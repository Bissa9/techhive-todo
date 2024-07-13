import express, { Request, Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
const cors = require('cors');


const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

app.use(cors())
app.use(express.json());


app.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.create({
    data: { email, password },
  });
  res.status(200).json(user);
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findFirstOrThrow({
    where: { email },
  });
  if (user && user.password === password) {
    res.status(200).json(user);
  } else {
    res.status(401).json({ error: 'Invalid email or password' });
  }
});

app.get('/todos', async (req: Request, res: Response) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

app.post('/todos', async (req: Request, res: Response) => {
  const { title, userId } = req.body;  
  try {
    const todo = await prisma.todo.create({
      data: { title, userId },
    });
    return res.status(200).json(todo);
  } catch(error) {
    return res.status(500).json({
      error: (error as Error).message ||  "Unknown error occured!"
    })
  }
});

app.put('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, complete } = req.body;

  const updatedTodo = {} as Prisma.TodoUpdateInput;
  if(title) {
    updatedTodo.title = title;
  }
  if(complete !== undefined) {
    updatedTodo.complete = complete;
  }

  try {
    const todo = await prisma.todo.update({
      where: { id },
      data: updatedTodo
    });
  
    return res.status(200).json(todo);
  } catch(error) {
    return res.status(500).json({error: "unknown error occured"})
  }  
});

app.delete('/todos/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.todo.delete({ where: { id } });
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
