const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: product }],
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: product }],
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newData = await Tag.create({
      tag_id: req.body.tag_id,
    });
    res.status(200).json(newData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
    // update product data
    Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((Tag) => {
        // find all associated tags from Tag
        return Tag.findAll({ where: { Tag_id: req.params.id } });
      })
      .then((TagTags) => {
        // get list of current tag_ids
        const TagIds = TagTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newTag = req.body.tagIds
          .filter((tag_id) => !TagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              Tag_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const TagToRemove = Tag
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
  
        // run both actions
        return Promise.all([
          Tag.destroy({ where: { id: TagTagsToRemove } }),
          Tag.bulkCreate(newTag),
        ]);
      })
      .then((updatedProductTags) => res.json(updatedProductTags))
      .catch((err) => {
        // console.log(err);
        res.status(400).json(err);
      });
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
