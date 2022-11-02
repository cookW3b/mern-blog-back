import PostModel from '../models/Post.js';

export const getAll = async(req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec();

		res.json(posts);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось получить все статьи'
		})
	}
}

export const getOne = async(req, res) => {
	try {
		const postId = req.params.id;
		PostModel.findOneAndUpdate({
			_id: postId,
		}, 
		{
			$inc: { viewsCount: 1},
		},
		{
			returnDocument: 'after',
		},
			(err, doc) => {
				if(err){
					console.log(err);
					res.status(500).json({
						message: 'Не удалось получить статью'
					});
				}

				if(!doc){
					return res.status(404).json({
						message:'Статья не найдена'
					})
				}

				res.json(doc);
			}
		).populate('user');
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось получить все статьи'
		})
	}
}

export const remove = async(req, res) => {
	try {
		const postId = req.params.id;
		PostModel.findOneAndDelete(
		{
			_id: postId,
		}, (err, doc) => {
			if(err){
				console.log(err);
				res.status(500).json({
					message: 'Не удалось удалить статью'
				})
			}

			if(!doc){
				return res.status(404).json({
					message: 'Статья не найдена'
				})
			}

			res.json({
				success: true,
			})
		})
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось удалить статью'
		})
	}
}

export const create = async(req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
			comments: req.body.comments
		});

		const post = await doc.save();
		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось создать статью'
		})
	}
};

export const update = async(req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne(
			{
				_id: postId,
			}, 
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				tags: req.body.tags,
				user: req.userId,
			}
		);
		res.json({
			success: true,
		})
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось обновить статью'
		})
	}
}

export const getLastTags = async(req, res) => {
	try {
		const posts = await PostModel.find().limit(3).exec();

		const tags = posts.map(obj => obj.tags).flat().slice(0, 3)

		res.json(tags);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось получить все статьи'
		})
	}
}

export const getSortByDate = async(req, res) => {
	try {
		const posts = await PostModel.find().sort([['createdAt', -1]]).exec();
		res.json(posts);
	} catch (error) {
		res.status(500).json({
			message: 'Не удалось отсортировать посты'
		})
	}
}

export const getSortByViews = async(req, res) => {
	try {
		const posts = await PostModel.find().sort([['viewsCount', -1]]).exec();
		res.json(posts);
	} catch (error) {
		res.status(500).json({
			message: 'Не удалось отсортировать посты'
		})
	}
}

export const getComments = async(req, res) => {
	try {
		const postId = await req.params.id;
		const post = await PostModel.findById(postId).select("comments");

		res.json(post);
	} catch (error) {
		res.status(500).json({
			message: 'Не удалось получить комментарии'
		})
	}
}

export const createComment = async(req, res) => {
	try {
		const postId = await req.params.id;
		const post = await PostModel.findById(postId).select("comments");
		const comments = post.comments;
		const newComments = [...comments, 
			{
				userName: req.userId,
				text: req.body.comments.text
			}];
		await PostModel.updateOne({
			_id: postId,
		},
		{
			comments: newComments,
		});

		res.json(post);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось отправить комментарий'
		})
	}
}