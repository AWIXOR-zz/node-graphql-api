const users = [
  {
    id: "1",
    username: "David",
    email: "test@test.com"
  },
  {
    id: "2",
    username: "Abraham",
    email: "smak@test.com"
  },
  {
    id: "3",
    username: "Sherlock",
    email: "kosh@test.com"
  }
];

const posts = [
  {
    id: "1",
    title: "Hey there",
    body: "hahahaha",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "Hello!",
    body: "hihihihi",
    published: true,
    author: "2"
  },
  {
    id: "3",
    title: "Good bye",
    body: "hehehehehe",
    published: false,
    author: "3"
  }
];

const comments = [
  {
    id: "1",
    text: "first comment",
    author: "2",
    post: "2"
  },
  {
    id: "2",
    text: "very nice comment",
    author: "2",
    post: "2"
  },
  {
    id: "3",
    text: "JavaScript FTW",
    author: "3",
    post: "1"
  }
];

const db = {
  users,
  posts,
  comments
};

export default db;
