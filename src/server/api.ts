import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/Task";
import { remult } from "remult";

export const api = remultExpress({
  entities: [Task],
  initApi: async () => {
    const taskRepo = remult.repo(Task);
    if ((await taskRepo.count()) === 0) {
      await taskRepo.insert([
        { title: "Task a" },
        { title: "Task b", completed: true },
        { title: "Task c" },
        { title: "Task d" },
        { title: "Task e", completed: true },
      ]);
    }
  },
  getUser: (request) => request.session!["user"],
});
