import { database } from "./database.js";
import { summarizeZepterCohortReadiness } from "./programCohort.js";

export const zepterProgramSlug = "zepter-acht-wochen";

export const zepterProgramStartDate = "2026-08-19";
export const zepterFirstReleaseDate = "2026-08-20";
export const zepterFirstLiveAt = "2026-08-19T16:30:00.000Z";

export const zepterWeeks = [
    ["Ich darf sein", "Ankommen, wahrnehmen und den gemeinsamen Weg beginnen"],
    ["Sakral - Ich darf fühlen und brauchen", "Kindheit, Gefühle, Bedürfnisse und Lebendigkeit"],
    ["Solarplexus - Ich darf mich zeigen und begrenzen", "Selbstwert, Autonomie, Grenzen und Sichtbarkeit"],
    ["Herz - Ich darf mir selbst begegnen", "Selbstliebe, Vergebung und Rückkehr zum Selbst"],
    ["Hals - Ich darf meine Wahrheit ausdrücken", "Ausdruck, Wahrheit, Entscheidung und Handlung"],
    ["Drittes Auge - Ich darf klarer sehen", "Perspektive, Beobachtung und das Verstehen von Mustern"],
    ["Krone - Ich darf vertrauen", "Vertrauen, Sinn, Bewusstsein und spirituelle Verbindung"],
    ["Achtes Zentrum - Ich verkörpere meinen Weg", "Verkörperung, Seelenverbindung und gemeinsames Feld"],
];

const addDays = (dateValue, days) => {
    const date = new Date(`${dateValue}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
};

export const defaultWeekContent = (weekNumber, title, focus) => ({
    weekNumber,
    title,
    focus,
    intro: weekNumber === 1
        ? "Nimm dir für diese Woche Zeit, die bereitgestellten Inhalte in deinem eigenen Tempo zu erleben. Du musst nichts vorwegnehmen und kannst das festhalten, was für dich persönlich wichtig ist."
        : "Diese Woche wird vor ihrer Freigabe mit dem Live-Impuls, der Meditation, dem Workbook und den passenden Alltagsschritten ergänzt.",
    releaseOn: addDays(zepterFirstReleaseDate, (weekNumber - 1) * 7),
    liveAt: weekNumber === 1 ? zepterFirstLiveAt : "",
    zoomUrl: "",
    meditationTitle: weekNumber === 1 ? "Meditation: Ich darf sein" : `Meditation für Woche ${weekNumber}`,
    meditationUrl: "",
    workbookLabel: weekNumber === 1 ? "Workbook Woche 1: Ich darf sein" : `Workbook - Woche ${weekNumber}`,
    workbookUrl: weekNumber === 1 ? `/api/members/programs/${zepterProgramSlug}/assets/1/workbook` : "",
    recordingUrl: "",
    tasks: weekNumber === 1 ? [
        { key: "live", label: "Am ersten Live teilnehmen oder später die Aufzeichnung ansehen" },
        { key: "meditation", label: "Die Meditation Ich darf sein erleben" },
        { key: "workbook", label: "Die Übungen aus Woche 1 in meinem Tempo bearbeiten" },
        { key: "alltag", label: "Sieben Tage lang einen kleinen Schritt für mehr inneren Boden üben" },
    ] : [
        { key: "meditation", label: "Meditation der Woche anhören" },
        { key: "workbook", label: "Workbook-Übung bearbeiten" },
        { key: "live", label: "Live-Termin oder Aufzeichnung ansehen" },
        { key: "alltag", label: "Einen konkreten Alltagsschritt ausprobieren" },
    ],
});

const parseContent = (value) => {
    if (!value) return null;
    try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        return parsed && typeof parsed === "object" ? parsed : null;
    } catch {
        return null;
    }
};

const dateOnly = (value) => {
    if (!value) return null;
    if (typeof value === "string") return value.slice(0, 10);
    return new Date(value).toISOString().slice(0, 10);
};

const toIsoString = (value) => value ? new Date(value).toISOString() : null;

const todayInIstanbul = () => {
    const parts = new Intl.DateTimeFormat("en", {
        timeZone: "Europe/Istanbul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
};

const mapProgram = (row) => ({
    id: Number(row.id),
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    startDate: dateOnly(row.start_date),
    durationWeeks: Number(row.duration_weeks),
    whatsappUrl: row.whatsapp_url || "",
    status: row.status,
});

export const initializeDefaultPrograms = async () => {
    await database.execute(
        `INSERT INTO programs (slug, title, subtitle, start_date, duration_weeks, status, whatsapp_url)
         VALUES (?, ?, ?, ?, 8, 'active', '')
         ON DUPLICATE KEY UPDATE slug = VALUES(slug)`,
        [
            zepterProgramSlug,
            "Das Zepter übernehmen",
            "Acht Wochen durch die Energiezentren - von innerem Halt zu gelebter Verkörperung",
            zepterProgramStartDate,
        ],
    );
    const [programRows] = await database.execute("SELECT id FROM programs WHERE slug = ? LIMIT 1", [zepterProgramSlug]);
    const programId = programRows[0]?.id;
    if (!programId) throw new Error("Default program could not be initialized");

    for (let index = 0; index < zepterWeeks.length; index += 1) {
        const weekNumber = index + 1;
        const content = defaultWeekContent(weekNumber, ...zepterWeeks[index]);
        const serialized = JSON.stringify(content);
        await database.execute(
            `INSERT INTO program_weeks (program_id, week_number, draft_content, published_content, published_at)
             VALUES (?, ?, ?, ?, UTC_TIMESTAMP())
             ON DUPLICATE KEY UPDATE program_id = VALUES(program_id)`,
            [programId, weekNumber, serialized, serialized],
        );
    }
};

export const prepareZepterProgramDraft = async () => {
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute(
            `UPDATE programs
             SET title = ?, subtitle = ?, start_date = ?, updated_at = UTC_TIMESTAMP()
             WHERE slug = ?`,
            [
                "Das Zepter übernehmen",
                "Acht Wochen durch die Energiezentren - von innerem Halt zu gelebter Verkörperung",
                zepterProgramStartDate,
                zepterProgramSlug,
            ],
        );
        const [programRows] = await connection.execute(
            "SELECT id FROM programs WHERE slug = ? LIMIT 1",
            [zepterProgramSlug],
        );
        if (!programRows[0]?.id) {
            await connection.rollback();
            return false;
        }

        for (let index = 0; index < zepterWeeks.length; index += 1) {
            const weekNumber = index + 1;
            const content = defaultWeekContent(weekNumber, ...zepterWeeks[index]);
            const [weekResult] = await connection.execute(
                `UPDATE program_weeks
                 SET draft_content = ?, updated_at = UTC_TIMESTAMP()
                 WHERE program_id = ? AND week_number = ?`,
                [JSON.stringify(content), programRows[0].id, weekNumber],
            );
            if (!weekResult.affectedRows) {
                await connection.rollback();
                return false;
            }
        }
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const getProgramRow = async (slug) => {
    const [rows] = await database.execute(
        `SELECT id, slug, title, subtitle, start_date, duration_weeks, whatsapp_url, status
         FROM programs WHERE slug = ? LIMIT 1`,
        [slug],
    );
    return rows[0] || null;
};

const hasProgramAccess = async ({ programId, member }) => {
    if (member.role === "admin") return true;
    const [rows] = await database.execute(
        `SELECT id FROM program_enrollments
         WHERE program_id = ? AND member_id = ? AND status = 'active'
           AND (access_ends_at IS NULL OR access_ends_at > UTC_TIMESTAMP())
         LIMIT 1`,
        [programId, member.id],
    );
    return Boolean(rows[0]);
};

export const getMemberProgram = async ({ slug, member }) => {
    const row = await getProgramRow(slug);
    if (!row || row.status === "archived") return null;
    if (row.status !== "active" && member.role !== "admin") return false;
    if (!await hasProgramAccess({ programId: row.id, member })) return false;

    const [weekRows, stateRows] = await Promise.all([
        database.execute(
            `SELECT id, week_number, draft_content, published_content, published_at
             FROM program_weeks WHERE program_id = ? ORDER BY week_number`,
            [row.id],
        ),
        database.execute(
            `SELECT weeks.week_number, states.task_key, states.completed_at
             FROM program_task_state AS states
             INNER JOIN program_weeks AS weeks ON weeks.id = states.program_week_id
             WHERE states.member_id = ? AND weeks.program_id = ?`,
            [member.id, row.id],
        ),
    ]);

    const completedTasks = new Set(stateRows[0].map((state) => `${state.week_number}:${state.task_key}`));
    const today = todayInIstanbul();
    const isAdminPreview = member.role === "admin";
    let totalTaskCount = 0;
    let completedTaskCount = 0;

    const weeks = weekRows[0].map((weekRow) => {
        const draft = parseContent(weekRow.draft_content) || {};
        const published = parseContent(weekRow.published_content);
        const content = published || draft;
        const releaseOn = content.releaseOn || row.start_date;
        const locked = !isAdminPreview && (!published || releaseOn > today);
        const tasks = Array.isArray(content.tasks) ? content.tasks : [];
        totalTaskCount += tasks.length;
        const visibleTasks = locked ? [] : tasks.map((task) => {
            const completed = completedTasks.has(`${weekRow.week_number}:${task.key}`);
            if (completed) completedTaskCount += 1;
            return { ...task, completed };
        });

        return {
            weekNumber: Number(weekRow.week_number),
            title: content.title || `Woche ${weekRow.week_number}`,
            focus: content.focus || "",
            releaseOn,
            liveAt: locked ? "" : (Number(weekRow.week_number) === 1 ? zepterFirstLiveAt : (content.liveAt || "")),
            locked,
            published: Boolean(published),
            publishedAt: toIsoString(weekRow.published_at),
            intro: locked ? "" : (content.intro || ""),
            zoomUrl: locked ? "" : (content.zoomUrl || ""),
            meditationTitle: locked ? "" : (content.meditationTitle || ""),
            meditationUrl: locked ? "" : (content.meditationUrl || ""),
            workbookLabel: locked ? "" : (content.workbookLabel || ""),
            workbookUrl: locked ? "" : (content.workbookUrl || ""),
            recordingUrl: locked ? "" : (content.recordingUrl || ""),
            tasks: visibleTasks,
        };
    });

    return {
        ...mapProgram(row),
        adminPreview: isAdminPreview,
        progress: {
            completed: completedTaskCount,
            total: totalTaskCount,
            percent: totalTaskCount ? Math.round((completedTaskCount / totalTaskCount) * 100) : 0,
        },
        weeks,
    };
};

export const getProgramsForMember = async (member) => {
    const row = await getProgramRow(zepterProgramSlug);
    if (!row || row.status === "archived") return [];
    if (!await hasProgramAccess({ programId: row.id, member })) return [];
    const program = await getMemberProgram({ slug: row.slug, member });
    if (!program) return [];
    const nextWeek = program.weeks.find((week) => !week.locked && week.tasks.some((task) => !task.completed))
        || program.weeks.find((week) => !week.locked)
        || program.weeks[0];
    return [{
        slug: program.slug,
        title: program.title,
        subtitle: program.subtitle,
        startDate: program.startDate,
        durationWeeks: program.durationWeeks,
        progress: program.progress,
        nextWeek: nextWeek ? { weekNumber: nextWeek.weekNumber, title: nextWeek.title, locked: nextWeek.locked } : null,
        adminPreview: program.adminPreview,
    }];
};

export const updateProgramTask = async ({ slug, member, weekNumber, taskKey, completed }) => {
    const program = await getMemberProgram({ slug, member });
    if (!program) return null;
    const week = program.weeks.find((item) => item.weekNumber === weekNumber);
    if (!week || week.locked || !week.tasks.some((task) => task.key === taskKey)) return false;

    const [weekRows] = await database.execute(
        `SELECT weeks.id FROM program_weeks AS weeks
         INNER JOIN programs ON programs.id = weeks.program_id
         WHERE programs.slug = ? AND weeks.week_number = ? LIMIT 1`,
        [slug, weekNumber],
    );
    const programWeekId = weekRows[0]?.id;
    if (!programWeekId) return false;

    if (completed) {
        await database.execute(
            `INSERT INTO program_task_state (member_id, program_week_id, task_key, completed_at)
             VALUES (?, ?, ?, UTC_TIMESTAMP())
             ON DUPLICATE KEY UPDATE completed_at = UTC_TIMESTAMP()`,
            [member.id, programWeekId, taskKey],
        );
    } else {
        await database.execute(
            "DELETE FROM program_task_state WHERE member_id = ? AND program_week_id = ? AND task_key = ?",
            [member.id, programWeekId, taskKey],
        );
    }
    return getMemberProgram({ slug, member });
};

export const getAdminProgram = async (slug) => {
    const row = await getProgramRow(slug);
    if (!row) return null;
    const [weekRows, memberRows, cohortRows] = await Promise.all([
        database.execute(
            `SELECT week_number, draft_content, published_content, published_at
             FROM program_weeks WHERE program_id = ? ORDER BY week_number`,
            [row.id],
        ),
        database.execute(
            `SELECT members.name, members.email, members.status AS member_status,
                    enrollments.status AS enrollment_status, enrollments.granted_at, enrollments.access_ends_at
             FROM members
             LEFT JOIN program_enrollments AS enrollments
               ON enrollments.member_id = members.id AND enrollments.program_id = ?
             ORDER BY enrollments.status = 'active' DESC, members.name, members.email`,
            [row.id],
        ),
        database.execute(
            `SELECT surveys.name AS survey_name, surveys.email AS survey_email,
                    members.email AS member_email, members.status AS member_status,
                    enrollments.status AS enrollment_status
             FROM zepter_schedule_surveys AS surveys
             LEFT JOIN members
               ON LOWER(TRIM(members.email)) = LOWER(TRIM(surveys.email))
             LEFT JOIN program_enrollments AS enrollments
               ON enrollments.member_id = members.id AND enrollments.program_id = ?
             ORDER BY surveys.name, surveys.email`,
            [row.id],
        ),
    ]);

    return {
        ...mapProgram(row),
        weeks: weekRows[0].map((week) => ({
            weekNumber: Number(week.week_number),
            draft: parseContent(week.draft_content),
            published: parseContent(week.published_content),
            publishedAt: toIsoString(week.published_at),
        })),
        members: memberRows[0].map((member) => ({
            name: member.name,
            email: member.email,
            memberStatus: member.member_status,
            enrollmentStatus: member.enrollment_status || "none",
            grantedAt: toIsoString(member.granted_at),
            accessEndsAt: toIsoString(member.access_ends_at),
        })),
        cohortReadiness: summarizeZepterCohortReadiness(cohortRows[0]),
    };
};

export const saveProgramSettings = async ({ slug, settings }) => {
    const [result] = await database.execute(
        `UPDATE programs SET title = ?, subtitle = ?, start_date = ?, whatsapp_url = ?, status = ?, updated_at = UTC_TIMESTAMP()
         WHERE slug = ?`,
        [settings.title, settings.subtitle, settings.startDate, settings.whatsappUrl, settings.status, slug],
    );
    if (result.affectedRows > 0) return true;
    return Boolean(await getProgramRow(slug));
};

export const saveProgramWeekDraft = async ({ slug, week }) => {
    const [result] = await database.execute(
        `UPDATE program_weeks AS weeks
         INNER JOIN programs ON programs.id = weeks.program_id
         SET weeks.draft_content = ?, weeks.updated_at = UTC_TIMESTAMP()
         WHERE programs.slug = ? AND weeks.week_number = ?`,
        [JSON.stringify(week), slug, week.weekNumber],
    );
    if (result.affectedRows > 0) return true;
    const [rows] = await database.execute(
        `SELECT weeks.id FROM program_weeks AS weeks
         INNER JOIN programs ON programs.id = weeks.program_id
         WHERE programs.slug = ? AND weeks.week_number = ? LIMIT 1`,
        [slug, week.weekNumber],
    );
    return Boolean(rows[0]);
};

export const publishProgramWeek = async ({ slug, weekNumber, memberId }) => {
    const connection = await database.getConnection();
    try {
        await connection.beginTransaction();
        const [rows] = await connection.execute(
            `SELECT weeks.id, weeks.draft_content
             FROM program_weeks AS weeks
             INNER JOIN programs ON programs.id = weeks.program_id
             WHERE programs.slug = ? AND weeks.week_number = ? FOR UPDATE`,
            [slug, weekNumber],
        );
        const week = rows[0];
        if (!week?.draft_content) {
            await connection.rollback();
            return false;
        }
        await connection.execute(
            `UPDATE program_weeks
             SET published_content = draft_content, published_by = ?, published_at = UTC_TIMESTAMP(), updated_at = UTC_TIMESTAMP()
             WHERE id = ?`,
            [memberId, week.id],
        );
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const setProgramEnrollment = async ({ slug, email, active, memberId }) => {
    const [memberRows] = await database.execute("SELECT id FROM members WHERE email = ? LIMIT 1", [email]);
    const targetMemberId = memberRows[0]?.id;
    if (!targetMemberId) return false;
    const program = await getProgramRow(slug);
    if (!program) return null;

    await database.execute(
        `INSERT INTO program_enrollments (program_id, member_id, status, granted_by, granted_at)
         VALUES (?, ?, ?, ?, UTC_TIMESTAMP())
         ON DUPLICATE KEY UPDATE status = VALUES(status), granted_by = VALUES(granted_by), granted_at = UTC_TIMESTAMP()`,
        [program.id, targetMemberId, active ? "active" : "revoked", memberId],
    );
    return true;
};
