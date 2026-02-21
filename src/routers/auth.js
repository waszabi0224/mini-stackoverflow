import Router from "express";

const router = Router();

router.post('/regisztracio', async(req, res) => {
    res.status(501).json({ message: "Regisztráció sikeres."});
});

router.post('/bejelentkezes', async(req, res) => {
    res.status(501).json({ message: "Regisztráció sikeres."});

});

export default router;
