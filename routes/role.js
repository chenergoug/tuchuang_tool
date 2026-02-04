const express = require('express')
const router = express.Router()
const roleController = require('../controllers/roleController')
const { authVerifyToken, authIsAdmin } = require('../middleware/auth')

router.get('/', authVerifyToken, authIsAdmin, roleController.getAllRoles)
