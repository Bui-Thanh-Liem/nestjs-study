import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReportEntity } from './entities/report.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepo: Repository<ReportEntity>,
  ) {}

  create(createReportDto: CreateReportDto, user: UserEntity) {
    const report = this.reportRepo.create(createReportDto);
    report.user = user;
    return this.reportRepo.save(report);
  }

  async approveReport(id: number, approved: boolean) {
    console.log(`Approving report with id ${id}`);

    const report = await this.reportRepo.findOneBy({ id });
    if (!report) throw new NotFoundException(`Report with id ${id} not found`);

    report.approved = approved;
    return await this.reportRepo.save(report);
  }

  async findAll() {
    return await this.reportRepo.find({ relations: ['user'] });
  }

  async findOne(id: number) {
    return await this.reportRepo.findOneBy({ id });
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const report = await this.reportRepo.findOneBy({ id });

    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }

    const updatedReport = this.reportRepo.merge(report, updateReportDto);
    return await this.reportRepo.save(updatedReport);
  }

  async remove(id: number) {
    const report = await this.reportRepo.findOneBy({ id });

    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }

    return await this.reportRepo.remove(report);
  }
}
