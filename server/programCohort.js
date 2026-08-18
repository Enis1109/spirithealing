export const summarizeZepterCohortReadiness = (rows = []) => {
    const participants = rows.map((participant) => {
        let readiness = "ready";
        if (!participant.member_email) readiness = "missing_account";
        else if (participant.member_status !== "active") readiness = "confirmation_pending";
        else if (participant.enrollment_status === "active") readiness = "active";
        return {
            name: participant.survey_name,
            email: participant.survey_email,
            memberEmail: participant.member_email || "",
            readiness,
        };
    });

    const count = (readiness) => participants.filter((participant) => participant.readiness === readiness).length;
    return {
        total: participants.length,
        readyCount: count("ready"),
        activeCount: count("active"),
        confirmationPendingCount: count("confirmation_pending"),
        missingAccountCount: count("missing_account"),
        participants,
    };
};
