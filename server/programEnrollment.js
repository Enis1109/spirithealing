export const enrollZepterParticipantIfEligible = async ({ connection, memberId, email }) => {
    const [result] = await connection.execute(
        `INSERT INTO program_enrollments (program_id, member_id, status, granted_by, granted_at)
         SELECT programs.id, ?, 'active', NULL, UTC_TIMESTAMP()
         FROM programs
         WHERE programs.slug = 'zepter-acht-wochen'
           AND EXISTS (
               SELECT 1
               FROM zepter_onboarding_submissions AS submissions
               WHERE LOWER(TRIM(submissions.email)) = LOWER(TRIM(?))
           )
         ON DUPLICATE KEY UPDATE
             status = 'active',
             access_ends_at = NULL,
             granted_at = UTC_TIMESTAMP()`,
        [memberId, email],
    );
    return result.affectedRows > 0;
};
