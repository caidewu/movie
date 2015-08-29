var express = require('express');
var Movie = require('../models/movie');
var User = require('../models/user');
var _ = require('lodash');
var moment = require('moment');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('index', {
            title: '首页',
            movies: movies
        });
    });

});

router.get('/admin/movie/list', function (req, res, next) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        console.log(movies);
        res.render('admin/movie/list', {
            title: '后台列表',
            movies: movies,
            moment: moment
        });
    });

    //movies:[
    //    {
    //        doctor: '八木龙一 / 山崎贵',
    //        country: '日本',
    //        title: '哆啦A梦：伴我同行',
    //        year: 2015,
    //        poster: 'http://doraemon-3d.com/',
    //        language: '日语',
    //        flash: 'http://player.youku.com/player.php/sid/XOTU0NzY5NTE2/v.swf',
    //        summary: '生活在日本东京的野比大雄（大原惠美 配音），是一个学习不上进、日常迷迷糊糊并且饱受同学欺负的男孩。他的性格不仅左右着自己的事业和婚姻，还对未来子孙产生莫大的影响。为此，大雄孙子的孙子世修（松本さち 配音）带着猫型机器人哆啦A梦（水田山葵 配音）乘坐时光机突然来访，期望彻底改变大雄及整个家族的命运。在哆啦A梦的帮助下，大雄不再受到胖虎（木村昴 配音）和小夫（关智一 配音）等人的欺负，他喜欢美丽的女孩源静香（嘉数由美 配音）。为了实现和静香结婚的命运，他和哆啦A梦穿越时空，见证了决定人生的最关键的时刻和事件。当大雄慢慢开始变得幸福之际，哆啦A梦也到了必须返回22世纪的时候…… '
    //    }
    //]
});

router.delete('/admin/movie/list', function (req, res) {
    var id = req.query.id;

    Movie.remove({_id: id}, function (err, movies) {
        if (err) {
            console.log(err);
        } else {
            res.json({success: 1});
        }
    });
});

router.get('/admin/movie/update/:id', function (req, res, next) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.render('admin/movie/add', {
                title: movie.title || '后台详情',
                movie: movie
            });
        });
    }


});

router.post('/admin/movie/save', function (req, res, next) {
    console.log(req.body);
    var id = req.body.movie._id;
    var movieObj = req.body.movie;

    var obj;

    if (id) { // 编辑
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            obj = _.extend(movie, movieObj);
            obj.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            });
        });
    } else { // 新增
        obj = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            language: movieObj.language,
            country: movieObj.country,
            summary: movieObj.summary,
            flash: movieObj.flash,
            poster: movieObj.poster,
            year: movieObj.year
        });
        obj.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });

    }

});

router.get('/admin/movie/add', function (req, res, next) {
    res.render('admin/movie/add', {
        title: '后台录入页',
        movie: {
            _id: '',
            doctor: '',
            title: '',
            language: '',
            country: '',
            summary: '',
            flash: '',
            poster: '',
            year: ''
        },
        test: {aa: 'dd', bb: 'bbb'}
    });
});

router.get('/movie/:id', function (req, res, next) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        if (err) {
            console.error(err);
        }
        //console.log(movie);
        res.render('movie/movie', {
            title: movie.title || '详情页',
            movie: movie
        });
    });
});

// 用户相关
router.post('/user/signup', function (req, res) {
    var _user = req.body.user; // 取得表单提交来的数据
    // req.param('user')  req.query.user req.body.user req.params.user
    console.log(_user);
    var user = new User(_user);
    user.save(function (err, user) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/user/list');
    })

});

router.get('/admin/user/list', function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        console.log(users);
        res.render('admin/user/list', {
            title: '用户列表',
            users: users,
            moment: moment
        });
    });
});

// 登录
router.post('/user/signin', function (req, res) {
    var _user = req.body.user; // 取得表单提交来的数据
    // req.param('user')  req.query.user req.body.user req.params.user
    console.log(_user);
    var name = _user.name;
    var password = _user.password;
    User.findOne({name: name}, function (err, user) {
        if (err) {
            console.log(err);
        }

        if(user) {
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    console.log(err)
                }
                if (isMatch) {
                    req.session.user = user;
                    return res.redirect('/');
                } else {
                    console.error('用户名或密码错误');
                }
            });
        } else {
            // 用户不存在
        }
    })

});

// 注销
router.get('/logout', function(req, res) {
    delete req.session.user;
    delete router.locals.user;
    res.redirect('/');
});
module.exports = router;
