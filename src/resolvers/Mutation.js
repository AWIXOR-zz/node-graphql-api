import uuidv4 from "uuid/v4";

const Mutation = {
  createComment: (
    _parent,
    { data: { text, author, post } },
    { users, posts, comments, pubSub },
    _info
  ) => {
    const userExists = users.some(user => user.id === author);
    const postExists = posts.some(item => item.id === post);

    if (!userExists) {
      throw new Error("User not found");
    }

    if (!postExists) {
      throw new Error("Post not found");
    }

    const comment = {
      id: uuidv4(),
      text,
      post,
      author
    };

    comments.push(comment);

    pubSub.publish(`comment-${post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });

    return comment;
  },
  deleteComment: (_parent, { id }, { comments, pubSub }, _info) => {
    const commentToBeDeleted = comments.findIndex(comment => comment.id === id);

    if (commentToBeDeleted === -1) {
      throw new Error("Comment not found");
    }

    comments = comments.splice(commentToBeDeleted, 1);

    pubSub.publish(`comment-${comments[0].post}`, {
      comment: {
        mutation: "DELETE",
        data: comments[0]
      }
    });

    return comments[0];
  },
  updateComment: (_parent, { id, data }, { comments, pubSub }, _info) => {
    const comment = comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubSub.publish(`comment-${comment.post}`, {
      comment: {
        mutation: "UPDATE",
        data: comment
      }
    });

    return comment;
  },
  createPost: (
    _parent,
    { data: { title, body, published, author } },
    { users, posts, pubSub },
    _info
  ) => {
    const userExists = users.some(user => user.id === author);

    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuidv4(),
      title,
      body,
      published,
      author
    };

    posts.push(post);

    if (published) {
      pubSub.publish("post", {
        post: {
          data: post,
          mutation: "CREATED"
        }
      });
    }

    return post;
  },
  deletePost: (_parent, { id }, { posts, comments, pubSub }, _info) => {
    const postToBeDeleted = posts.findIndex(post => post.id === id);

    if (postToBeDeleted === -1) {
      throw new Error("Post not found");
    }

    posts = posts.splice(postToBeDeleted, 1);
    comments = comments.filter(comment => comment.post !== id);

    if (posts[0].published) {
      pubSub.publish("post", {
        post: {
          data: posts[0],
          mutation: "DELETED"
        }
      });
    }

    return posts[0];
  },
  updatePost: (_parent, { id, data }, { posts, pubSub }, _info) => {
    const post = posts.find(post => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubSub.publish("post", {
          post: {
            data: originalPost,
            mutation: "DELETED"
          }
        });
      } else if (!originalPost.published && post.published) {
        pubSub.publish("post", {
          post: {
            data: post,
            mutation: "CREATED"
          }
        });
      } else {
        pubSub.publish("post", {
          post: {
            data: post,
            mutation: "UPDATED"
          }
        });
      }
    }

    return post;
  },
  createUser: (_parent, { data: { username, email } }, { users }, _info) => {
    const emailIsTaken = users.some(item => item.email === email);

    if (emailIsTaken) {
      throw new Error("email is already taken");
    }

    const user = {
      id: uuidv4(),
      email,
      username
    };

    users.push(user);
    return user;
  },
  deleteUser: (_parent, { id }, { users, posts, comments }, _info) => {
    const userToBeDeleted = users.findIndex(user => user.id === id);

    if (userToBeDeleted === -1) {
      throw new Error("User not found");
    }

    users = users.splice(userToBeDeleted, 1);
    posts = posts.filter(post => {
      const match = post.author === id;

      if (match) {
        comments = comments.filter(comment => comment.post !== post.id);
      }

      return !match;
    });
    comments = comments.filter(comment => comment.author !== id);

    return users[0];
  },
  updateUser: (_parent, { id, data }, { users }, _info) => {
    const user = users.find(user => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const emailIsTaken = users.some(user => user.email === data.email);

      if (emailIsTaken) {
        throw new Error("Email is already taken");
      }

      user.email = data.email;
    }

    if (typeof data.email === "string") {
      user.username = data.username;
    }

    return user;
  }
};

export default Mutation;
