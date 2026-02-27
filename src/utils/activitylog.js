import db from "../db/prisma.js";

function writeLog(activityLog) {
    return db.activityLog.create({
        data: {
            action: activityLog.action,
            userId: activityLog.userId,
            entityId: activityLog.entityId,
            entityType: activityLog.entityType,
            metadata: activityLog.metadata,
        },
    });
}

export default writeLog;

//{ action, userId, entityId, entityType, metadata }