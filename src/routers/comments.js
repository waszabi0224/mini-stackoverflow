import Router from "express";
import db from "../db/prisma.js";
import isAuthenticated from "../utils/middlewares.js";

const router = Router();

//létrehozás
router.post('/:ticketId', isAuthenticated, async(req, res, next) => {
    try {
        const ownerId = req.payload.userId;
        const ticketId = Number(req.params.ticketId);
        const { text } = req.body;

        const ticket = await findTicketById(ticketId);

        if(!text) {
            res.status(400);
            throw new Error("Töltsd ki a kötelező mezőket.");
        }

        if(!ticket) {
            res.status(400);
            throw new Error("Nincs ilyen ticket.");
        }

        if(ownerId !== ticket.userId) {
            res.status(400);
            throw new Error("Ehhez a ticket-hez nem szólhatsz hozzá.");
        }

        const comment = await createComment({ text }, ownerId, ticketId);
        res.json({
            comment,
        });
    } catch (err) {
        next(err);
    }
});

//összes listázása
router.get('/:ticketId', async(req, res, next) => {
    try {
        const ticketId = Number(req.params.ticketId);

        const comments = await findComment(ticketId);
        res.json({
            comments,
        });
    } catch (err) {
        next(err);
    }
});

//módosítás
router.patch('/:id', isAuthenticated, async(req, res, next) => {
    try {
        const ownerId = req.payload.userId;
        const commentId = Number(req.params.id);
        const { text } = req.body;

        let comment = await findCommentById(commentId);

        if(!comment) {
            res.status(400);
            throw new Error("Nincs ilyen comment.");
        }

        if(comment.userId !== ownerId) {
            res.status(400);
            throw new Error("Nem módosíthatod ezt a commentet.");
        }

        comment = await updateComment({ text }, commentId);
        res.json({
            comment,
        });
    } catch (err) {
        next(err);
    }
});

//törlés
router.delete('/:id', isAuthenticated, async(req, res, next) => {
    try {
        const ownerId = req.payload.userId;
        const commentId = Number(req.params.id);

        let comment = await findTicketById(commentId);

        if(!comment) {
            res.status(400);
            throw new Error("Nincs ilyen comment.");
        }

        if(comment.userId !== ownerId) {
            res.status(400);
            throw new Error("Nem törölheted ezt a commentet.");
        }

        comment = await deleteComment(commentId);
        res.json({
            comment,
        });
    } catch (err) {
        next(err);
    }
});

function createComment(comment, ownerId, ticketId) {
    return db.comment.create({
        data: {
            userId: ownerId,
            ticketId: ticketId,
            text: comment.text,
        },
    });
}

function updateComment(updatecomment, id) {
    return db.comment.update({
        where: {
            id,
        },
        data: {
            text: updatecomment.text,
        },
    });
}

function deleteComment(id) {
    return db.comment.delete({
        where: {
            id,
        },
    });
}

function findComment(id) {
    return db.comment.findMany({
        where: {
            ticketId: id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

function findTicketById(id) {
    return db.ticket.findUnique({
        where: {
            id,
        },
    });
}

function findCommentById(id) {
    return db.comment.findUnique({
        where: {
            id,
        },
    });
}

export default router;
