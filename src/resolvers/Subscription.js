const Subscription = {
  comment: {
    subscribe: (_parent, { postId }, { pubSub, posts }, _info) => {
      const postExists = posts.find(
        post => post.id === postId && post.published
      );

      if (!postExists) {
        throw new Error("Post not found");
      }

      return pubSub.asyncIterator(`comment-${postId}`);
    }
  },
  post: {
    subscribe: (_parent, _args, { pubSub }, _info) => {
      return pubSub.asyncIterator("post");
    }
  }
};

export default Subscription;
