import {Task} from '../models/task.model.js';
import { createTaskSchema, updateTaskSchema } from '../validation/task.schemas.js';

function parseNumber(val, def) {
    const n = Number(val);
    return Number.isFinite(n) && n >= 0 ? n : def;
}

// POST /api/tasks
export async function createTask(req, res, next) {
    try {
        const parsed = createTaskSchema.safeParse(req.body);
        if(!parsed.success) return res.status(400).json({error: parsed.error.issues});

        const doc = await Task.create({...parsed.data, owner: req.user._id});
        res.status(201).json({task: doc});
    } catch (err) {
        next(err);
    }
}

// GET /api/tasks  (pagination + filters + search + sort)
export async function listTasks(req, res, next) {
    try{
        const { q, status, priority, sort = "-createdAt"} = req.query;

        const page = parseNumber(req.query.page, 1);
        const limit = Math.min(parseNumber(req.query.limit, 10), 100);
        const skip = (page - 1) * limit;

        // owner scope
        const filter = { owner: req.user._id };
        if(status) filter.status = status;
        if(priority) filter.priority = priority;

        // simple search on title/description
        if(q) {
           filter.$or = [ 
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
           ];
        }

        // allowed sorts
        const sortMap = {
            "createdAt": "createdAt",
            "-createdAt": "-createdAt",
            "dueDate": "dueDate",
            "-dueDate": "-dueDate",
            "priority": "priority",
            "-priority": "-priority"
        };

        const sortBy = sortMap[sort] || sortMap["-createdAt"]; // fallback to default

        const [items, total] = await Promise.all([
            task.find(filter).sort(sortBy).skip(skip).limit(limit),
            Task.countDocuments(filter)
        ]);

        res.json({
            items, page, limit, total, pages: Math.ceil(total / limit)
        });
    } catch (err) {
        next(err);
    }
}


// GET /api/tasks/:id
export async function getTask(req, res, next) {
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ task });

    } catch (err) {
        next(err);
    }
}

// PATCH /api/tasks/:id
export async function updateTask(req, res, next) {
    try {
        const parsed = updateTaskSchema.safeParse(req.body);
        if(!parsed.success) return res.status(400).json({error: parsed.error.issues});
        
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            parsed.data,
            { new: true }
        );
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json({ task });
    } catch (err) {
        next(err);
    }
}

// DELETE /api/tasks/:id
export async function deleteTask(req, res, next) {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}