const router = require('express').Router();
const { Event, EventTags, Tag, User } = require('../models')
// Import custom middleware
const withAuth = require('../utils/auth');


// get all events (use custom middleware before allowing user to access all)
router.get('/', withAuth, (req, res) => {
    Event.findAll({
        attributes: [
            'id',
            'name',
            'location',
            'description',
            'date'
        ],
        include: [
            {
                model: User, 
                attributes: [
                    'id',
                    'username'
                ]
            },
            {
                model: Tag,
                attributes: [
                    'id',
                    'tag_title'
                ],
                through: EventTags,
                as: 'tags'
            }
        ]
    })
    .then(dbEventData => {
        if (!dbEventData) {
            res.status(404).json({ message: 'No events found'})
        }
        const events = dbEventData.map(event => event.get({ plain: true }));
        res.render('dashboard', {
            events,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

// NEED TO FIND A WAY TO GET EVENTS AND TAGS FOR DASHBAORD
// get all tags
router.get('/', withAuth, (req, res) => {
    Tag.findAll({
        attributes: [
            'id',
            'tag_title'
        ]
    })
    .then(dbTagData => {
        if (!dbTagData) {
            res.status(404).json({ message: 'No tags found'})
        }
        const tags = dbTagData.map(tag => tag.get({ plain: true }));
        console.log(tags);
        res.render('dashboard', {
            tags,
            loggedIn: req.session.loggedIn
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});


module.exports = router;