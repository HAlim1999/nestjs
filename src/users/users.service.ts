import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose"
import { FilterUsersDto } from './dto/filter-user.dto';
import { HashingService } from 'src/providers/hashing/hashing.service';
import { ErrorService } from 'src/errors/errors.service';
import { ErrorLoggerServices } from 'src/errors/errors-logger.service';


@Injectable()
export class UsersService {
  constructor( @InjectModel(User.name) private readonly userModel: Model<User>, private readonly hashingService: HashingService, private readonly errorsService: ErrorService, private readonly errorLoggerService: ErrorLoggerServices){}

  async create(payload: CreateUserDto) {
    try{
      payload.password = await this.hashingService.hash(payload.password.trim());
      const newRecord = new this.userModel(payload);
      return await newRecord.save();

    }catch(error){
      this.errorLoggerService.createErrorLog("Error", error);
      this.errorsService.createError(error)
    }
  }

  async findAll(params?: FilterUsersDto) {
    try{
      const filters: FilterQuery<User> = { isDeleted: false };
      const {limit, offset, firstName, lastName} = params;
      if(params){
        if(firstName){
            filters.firstName ={
                $regex: firstName,
                $options: "i"
              }
        }
        if(lastName){
          filters.lastName={
              $regex: lastName,
              $options: "i"
          }
      }
      }


      const [records, totalDocuments ] = await Promise.all([
        this.userModel
        .find(filters)
        .limit(limit)
        .skip(offset || 0 * limit || 0)
        .exec(),
        this.userModel.countDocuments(filters).exec(),
      ])

      return {
        totalDocuments,
        records
      }

    }catch(error){
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      /** Buscamos el registro por el ID */
      const record = await this.userModel.findById(id.trim()).exec();

      /** Si el registro no existe */
      if (!record) {
        throw new NotFoundException("Registro no encontrado");
      }

      /** Preguntamos si el registro no esta eliminado (lógico) */
      if (record.isDeleted) {
        throw new NotFoundException("Registro no encontrado");
      }

      return record;
    } catch (error) {
      /** Creamos el error personalizado */
      this.errorsService.createError(error);
    }
  }

  async update(id: string, payload: UpdateUserDto) {
    try {
      const record = await this.findOne(id);
      /** Hasheamos la contraseña */
      if (payload.password) {
        payload.password = await this.hashingService.hash(payload.password.trim());
      }
      return await this.userModel.findByIdAndUpdate(record.id, { $set: payload }, { new: true, runValidators: true }).exec();
    } catch (error) {
      /** Creamos el error personalizado */
      this.errorsService.createError(error);
    }
  }

  /** Eliminacion lógica de un registro */
  async delete(id: string) {
    try {
      const record = await this.findOne(id);

      return await this.userModel.findByIdAndUpdate(record.id, { $set: { isDeleted: !record.isDeleted } }, { new: true, runValidators: true }).exec();
    } catch (error) {
      /** Creamos el error personalizado */
      this.errorsService.createError(error);
    }
  }

 /** Eliminacion física de un registro */
 async remove(id: string) {
  try {
    await this.findOne(id);
    return await this.userModel.findByIdAndRemove(id).exec();
  } catch (error) {
    /** Creamos el error personalizado */
    this.errorsService.createError(error);
  }
}
}
