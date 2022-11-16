const express = require('express')
const userController = require('../controllers/user')
const { requireAuth, forwardAuth } = require('../middlewares/user')

const router = express.Router()

router.get('/login', forwardAuth, userController.getLoginPage)
router.post('/login', userController.postLoginPage)

router.get('/dashboard', requireAuth, userController.getUserDashboard)

router.get('/create-user', requireAuth, userController.getCreateUser)

router.post('/create-user', requireAuth, userController.postCreateUser)

router.get('/table-of-persons', requireAuth, userController.getTableOfPersons)

router.get('/data-sheet', requireAuth, userController.getDataSheet)

router.get('/unauthorized', userController.getError403)

router.get('/logout', requireAuth, userController.getUserLogOut)

module.exports = router