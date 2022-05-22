"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoc = exports.updateCurrentUserInfo = exports.fetchCurrentUser = exports.fetchAll = void 0;
const user_1 = require("../models/user");
const AppError_1 = __importDefault(require("../utils/AppError"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const fetchAll = (0, asyncHandler_1.default)(async (req, res, next) => {
    const docs = await user_1.User.find();
    res.status(200).json({
        status: 'success',
        docs,
    });
});
exports.fetchAll = fetchAll;
const createDoc = (0, asyncHandler_1.default)(async (req, res, next) => {
    console.log('CRREATING', req.body);
    const doc = await user_1.User.create(req.body);
    if (!doc)
        return next(new AppError_1.default(`We can't create document ${req.body.name}`, 404));
    res.status(201).json({
        status: 'success',
        doc,
    });
});
exports.createDoc = createDoc;
const fetchCurrentUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    // console.log('REqPARAMS', req.cookies)
    // console.log('REqUser', req.user)
    if (!req.user || !req.user._id)
        return next(new AppError_1.default(`We can't find a user with the supplied credentials}`, 404));
    const user = await user_1.User.findById(req.user.id);
    if (!user)
        return next(new AppError_1.default(`We can't find a user with id = ${req.params.id}`, 404));
    res.status(200).json({
        status: 'succes',
        user,
    });
});
exports.fetchCurrentUser = fetchCurrentUser;
// import factory from '../controllers/factory'
// const multerStorage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, 'public/img/users')
// 	},
// 	filename: function (req, file, cb) {
// 		const ext = file.mimetype.split('/')[1]
// 		cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
// 	},
// })
// const multerFilter = (req, file, cb) => {
// 	if (file.mimetype.startsWith('image')) {
// 		cb(null, true)
// 	} else {
// 		cb(new AppError('Only images are allowed', 400), false)
// 	}
// }
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter })
// const upload = multer({ dest: 'public/img/users/' })
// exports.uploadUserPhoto = upload.single('photo')
const filteredObj = (obj, allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((prop) => {
        if (allowedFields.includes(prop))
            newObj[prop] = obj[prop];
    });
    return newObj;
};
const SendResponse = async (user, statusCode, res) => {
    res.status(statusCode).json({
        status: 'success',
        data: user,
    });
};
// const fetchLoggedIn = asyncHandler(async (req, res, next) => {
//   req.params.id = req.user.id
//   next()
// })
// const updateCurrentUserPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   if (!req.user || !req.user._id) return next(new AppError(`We can't find a user with the supplied credentials}`, 404))
//   const user = await User.findById(req.user._id).select('+password')
//   if (!user) return next(new AppError('You must be logged in to update your password', 401))
//   if (!(await user.checkPassword(req.body.currentPassword, String(user.password))))
//     return next(new AppError('Invalid current password', 401))
//   // if (req.body.password) return next(new AppError('You cannot use this route for passsword updates', 400))
//   // const filteredBody = filteredObj(req.body, ['name', 'email'])
//   // if (req.file) filteredBody.photo = req.file.filename
//   // const newUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
//   //   new: true,
//   //   runValidators: true,
//   // })
//   user.password= req.body.password
//   await user.save()
//   // if (!user) return next(new AppError('You must be logged in to change your data', 401))
//   //   createSendData(user, 200, res)
// })
const updateCurrentUserInfo = (0, asyncHandler_1.default)(async (req, res, next) => {
    if (req.body.password)
        return next(new AppError_1.default('You cannot use this route for passsword updates', 400));
    const filteredBody = filteredObj(req.body, ['name', 'email', 'shippingAddresses']);
    console.log('RU', req.user);
    console.log('RB', req.body);
    console.log('FB', filteredBody);
    if (!req.user || !req.user._id)
        return next(new AppError_1.default('We cannot find a user with this id', 400));
    const user = await user_1.User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true,
    });
    if (!user)
        return next(new AppError_1.default('You must be logged in to change your data', 401));
    SendResponse(user, 200, res);
});
exports.updateCurrentUserInfo = updateCurrentUserInfo;
const deleteLoggedIn = (0, asyncHandler_1.default)(async (req, res, next) => {
    // await Model.findByIdAndUpdate(req.user.id, { active: false })
    // SendResponse(null, 200, res)
});
const createUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined.  Please use /signup instead',
    });
});
// exports.getAllUsers = factory.getAll(User)
// exports.getUser = factory.getOne(User)
// exports.updateUser = factory.updateOne(User)
// exports.deleteUser = factory.deleteOne(User)
