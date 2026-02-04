const express = require('express')
const router = express.Router()
const { authVerifyToken, authIsAdmin } = require('../middleware/auth')

const userController = require('../controllers/userController')

router.get('/', authVerifyToken, userController.getUsers) // GET /api/users
router.get('/:id', authVerifyToken, userController.getUser) // GET /api/users/:id
router.put('/:id', authVerifyToken, userController.updateUser) // PUT /api/users/:id
router.delete('/:id', authVerifyToken, authIsAdmin, userController.deleteUser) // DELETE /api/users/:id

module.exports = router
