/*
  Warnings:

  - The values [LOGIN,LOGOUT] on the enum `Action` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Action_new" AS ENUM ('NEW_USER_REGISTERED', 'USER_LOGIN', 'USER_LOGOUT', 'TICKET_CREATED', 'TICKET_UPDATED', 'TICKET_DELETED', 'COMMENT_CREATED', 'COMMENT_UPDATED', 'COMMENT_DELETED');
ALTER TABLE "ActivityLog" ALTER COLUMN "action" TYPE "Action_new" USING ("action"::text::"Action_new");
ALTER TYPE "Action" RENAME TO "Action_old";
ALTER TYPE "Action_new" RENAME TO "Action";
DROP TYPE "public"."Action_old";
COMMIT;
