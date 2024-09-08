import PostModel from '../models/Post.js';

const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to get posts',
    });
    console.log(error);
  }
};

const getPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { viewsCount: 1 },
      },
      { returnDocument: 'after' }
    );

    if (!doc) {
      return res.status(404).json({
        message: 'Post was not found',
      });
    }

    res.json(doc);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to get a post',
    });
    console.log(error);
  }
};

const createPost = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      body: req.body.body,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to create a post',
    });
    console.log(error);
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findByIdAndDelete(postId).then(() => {
      res.status(200).json({
        message: 'Post deleted',
      });
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to delete a post',
    });
    console.log(error);
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const doc = await PostModel.findByIdAndUpdate(
      { _id: postId },
      {
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags,
        imageUrl: req.body.imageUrl,
      },
      { new: true, useFindAndModify: false }
    );

    if (doc) {
      console.log('Post updated successfully:', doc);
    } else {
      console.log('Post was not found');
    }

    res.json(doc);
  } catch (error) {
    res.status(500).json({
      message: 'Unable to update a post',
    });
    console.log(error);
  }
};

export { getAll, getPost, createPost, deletePost, updatePost };
