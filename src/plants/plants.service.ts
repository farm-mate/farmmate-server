import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {In, IsNull, Repository} from 'typeorm';
import { Plant } from './entities/plant.entity';
import { CreatePlantDto } from './dto/create-plant.dto';
import { UpdatePlantDto } from './dto/update-plant.dto';
import {Device} from "../devices/entities/device.entity";
import { Bookmark } from "./entities/bookmark.entity";
import { Disease } from './entities/disease.entity';

import { PipeTransform, BadRequestException} from '@nestjs/common';


@Injectable()
export class PlantsService {
  constructor(
      @InjectRepository(Plant)
      private plantsRepository: Repository<Plant>,
      @InjectRepository(Device)
      private deviceRepository: Repository<Device>,
      @InjectRepository(Bookmark)
      private bookmarkRepository: Repository<Bookmark>,
      @InjectRepository(Disease)
      private diseaseRepository: Repository<Disease>
  ) {}

  getAll(): Promise<Plant[]> {
    return this.plantsRepository.find();
  }

  // 디바이스별로 생성된 식물 리스트 조회
  async getAllByDeviceId(deviceId: string): Promise<any[]> {
    const plants = await this.plantsRepository.find({
      where: { device: { device_id: deviceId } },
      relations: ['device']
    });

    if (!plants.length) {
      throw new NotFoundException(`Plants with Device Id ${deviceId} not found`);
    }

    const plantsWithBookmarks = await Promise.all(plants.map(async (plant) => {
      const bookmark = await this.bookmarkRepository.findOne({
        where: { plant: { plant_uuid: plant.plant_uuid } }
      });

      return {
        ...plant,
        bookmark: bookmark ? {
          bookmark_uuid: bookmark.bookmark_uuid,
        } : null
      };
    }));

    return plantsWithBookmarks;
  }


  // 식물 조회
  async getOne(plant_uuid: string): Promise<any> {
    const plant = await this.plantsRepository.findOne({
      where: { plant_uuid }
    });

    if (!plant) {
      throw new NotFoundException(`Plant with UUID ${plant_uuid} not found`);
    }
    const bookmark = await this.bookmarkRepository.findOne({
      where: { plant : {plant_uuid: plant_uuid}}
    })

    const plantResponse = {
      ...plant,
      bookmark: bookmark ? {
        bookmark_uuid: bookmark.bookmark_uuid,
      } : null
    };
    return plantResponse;
  }

  async create(plantData: CreatePlantDto): Promise<Plant[]> {

    const deviceInstance = await this.deviceRepository.findOneBy({ device_id: plantData.deviceId });

    const plantDetails: any = {
      plant_type: plantData.plantType,
      plant_name: plantData.plantName,
      plant_location: plantData.plantLocation,
      memo: plantData.memo,
      first_planting_date: plantData.firstPlantingDate,
      image_url: plantData.imageUrl,
    };

    if (deviceInstance) {
      plantDetails.device = deviceInstance;
    }

    const newPlant = this.plantsRepository.create(plantDetails);
    await this.plantsRepository.save(newPlant);
    return newPlant;
  }

  async update(plant_uuid: string, updateData: UpdatePlantDto): Promise<Plant[]> {
    const plant = await this.getOne(plant_uuid);
    const newPlant: any =  {
      plant_type: updateData.plantType,
      plant_name: updateData.plantName,
      plant_location: updateData.plantLocation,
      memo: updateData.memo,
      first_planting_date: updateData.firstPlantingDate,
      image_url: updateData.imageUrl,
    }
    Object.assign(plant, newPlant);
    await this.plantsRepository.save(plant);
    return plant;
  }

  async deleteOne(plant_uuid: string): Promise<void> {
    const result = await this.plantsRepository.softDelete({ plant_uuid });
    if (result.affected === 0) {
      throw new NotFoundException(`Plant with UUID ${plant_uuid} not found`);
    }
  }

  async bookmark(plantUuid: string): Promise<string> {
    const plant = await this.plantsRepository.findOne({
      where: { plant_uuid: plantUuid },
      relations: ['device'],
    });


    if (!plant) {
      throw new NotFoundException(`Plant with UUID ${plantUuid} not found.`);
    }


    const existingBookmark = await this.bookmarkRepository.findOne({
      where: { plant: { plant_uuid: plantUuid } },
      withDeleted: true
    });


    if (!existingBookmark) {
      const newBookmark = this.bookmarkRepository.create({
        plant: plant,
        device: plant.device,
      });
      await this.bookmarkRepository.save(newBookmark);
      return '북마크가 등록되었습니다.';
    } else {
      if (existingBookmark.deleted_at) {
        existingBookmark.deleted_at = null;
        await this.bookmarkRepository.save(existingBookmark);
        return '북마크가 다시 등록되었습니다.';
      } else {
        await this.bookmarkRepository.softDelete({ bookmark_uuid: existingBookmark.bookmark_uuid });
        return '북마크가 해제되었습니다.';
      }
    }
  }

  async findAllBookmarksByDeviceId(deviceId: string): Promise<Plant[]> {
    const bookmarks = await this.bookmarkRepository.find({
      where: { device: { device_id: deviceId }, deleted_at: IsNull() },
      relations: ['plant'] // This should match the relation name in Bookmark entity.
    });

    const plantIds = bookmarks.map(bookmark => bookmark.plant?.plant_uuid).filter(uuid => uuid != null);

    if (plantIds.length === 0) {
      return [];
    }
    const plants = await this.plantsRepository.find({
      where: { plant_uuid: In(plantIds) }
    });

    return plants;
  }


  /*
  * 진단
  * */


  async findByPlantTypeAndDiagnosisCode(plantType: string, diagnosisCode: number): Promise<any> {
    const disease = await this.diseaseRepository.findOne({
      where: { plantName: plantType, diagnosisCode: diagnosisCode },
    });

    if (!disease) {
      throw new NotFoundException(`해당 식물 타입(${plantType})과 진단 코드(${diagnosisCode})에 대한 질병 정보를 찾을 수 없습니다.`);
    }
    return disease;
  }

}



@Injectable()
export class FormDataParseBooleanPipe implements PipeTransform<string, boolean> {
  transform(value: string): boolean {
    if (value === 'true') {  // 'true' 문자열 처리
      return true;
    } else if (value === 'false') {  // 'false' 문자열 처리
      return false;
    } else {
      throw new BadRequestException(`Validation failed. Boolean value expected, but received: ${value}`);
    }
  }
}

