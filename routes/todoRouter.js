const express = require('express');
const ToDo = require('../models/todo');
const todoRouter = express.Router();
const authenticate = require('../authenticate');

// TODO : TEST ALL ENDPOINTS

todoRouter.use(express.json());

todoRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        // get all todo items of the user
        ToDo.find({ account: req.user._id })
            .populate('account')
            .then((todos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todos);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        // creaates todo item
        ToDo.create({
            title: req.body.title,
            desc: req.body.desc,
            account: req.user._id
        })
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        // deletes permanently all todo items
        ToDo.remove({ account: req.user._id })
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end('All Todos have been permanently deleted');
            })
    })

todoRouter.route('/completed')
    .get(authenticate.verifyUser, (req, res, next) => {
        // returns list of completed todo items
        ToDo.find({ isDone: true, account: req.user._id })
            .populate('account')
            .then((todos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todos);
            })
            .catch((err) => next(err));
    })

todoRouter.route('/deleted')
    .get(authenticate.verifyUser, (req, res, next) => {
        // returns list of deleted/trash todo items
        ToDo.find({ isTrash: true, account: req.user._id })
            .then((todos) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todos);
            })
            .catch((err) => next(err));
    })

todoRouter.route('/:id')
    .get(authenticate.verifyUser, (req, res, next) => {
        // returns specific todo item
        ToDo.findOne({ _id: req.params.id, account: req.user._id })
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        // complete specific todo item
        ToDo.findOneAndUpdate({ _id: req.params.id, account: req.user._id }, {
            $set: { isDone: true }
        })
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err))
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        // update specific todo item
        ToDo.findOneAndUpdate({ _id: req.params.id, account: req.user._id }, {
            $set: req.body
        })
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));

    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        // delete specific todo item
        ToDo.findOne({ _id: req.params.id, account: req.user._id })
            .then((todo) => {
                if (todo.isTrash) {
                    ToDo.remove({ _id: req.params.id, account: req.user._id })
                        .then(() => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end('Todo have been deleted');
                        })
                } else {
                    ToDo.updateOne({ _id: req.params.id, account: req.user._id }, {
                        $set: { isTrash: true }
                    })
                        .then(() => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.end('Todo moved to Trash');
                        })
                        .catch((err) => next(err));
                }
            })
    })

todoRouter.route('/:id/recycle')
    .post(authenticate.verifyUser, (req, res, next) => {
        // recycle or restore deleted todo
        ToDo.findOneAndUpdate({ _id: req.params.id, account: req.user._id }, {
            $set: { isTrash: false }
        })
            .then((todo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(todo);
            })
            .catch((err) => next(err));
    })


module.exports = todoRouter;