import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<TaskDocument>,
  ) {}

  async findAll(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task.toJSON() as unknown as Task;
  }

  async create(task: Task): Promise<Task> {
    const created = new this.taskModel(task);
    await created.save();
    return created.toJSON() as unknown as Task;
  }

  async update(id: string, updateTaskDto: Partial<Task>): Promise<Task> {
    const updated = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return updated.toJSON() as unknown as Task;
  }

  async remove(id: string): Promise<void> {
    const res = await this.taskModel.deleteOne({ _id: id }).exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
