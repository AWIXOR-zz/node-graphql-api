import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

const createPost = async (authorId, data) => {
  try {
    const userExists = await prisma.exists.User({ id: authorId });

    if (!userExists) {
      throw new Error("User not found");
    }

    const post = await prisma.mutation.createPost(
      {
        data: {
          ...data,
          author: {
            connect: {
              id: authorId
            }
          }
        }
      },
      "{ author { id username posts { id title body published } } }"
    );

    return post.author;
  } catch (err) {
    console.log(err.message);
  }
};

const updatePost = async (postId, data) => {
  try {
    const postExists = await prisma.exists.Post({ id: postId });

    if (!postExists) {
      throw new Error("Post not found");
    }

    const updatedPost = await prisma.mutation.updatePost(
      {
        where: {
          id: postId
        },
        data
      },
      "{ author { id username posts { id title body published } } }"
    );

    return updatedPost.author;
  } catch (err) {
    console.log(err.message);
  }
};

// createPost("ck1l6imj700b20768bvc1pzgf", {
//   title: "my new awesome book",
//   body: "you should read my book",
//   published: true
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch(err => console.log(err));
