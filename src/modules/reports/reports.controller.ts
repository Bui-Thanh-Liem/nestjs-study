import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serializer } from 'src/interceptors/serializer.interceptor';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportDto } from './dto/report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';
import { ApprovalReportDto } from './dto/approval-report.dto';
import { RoleGuard } from 'src/guards/role.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serializer(ReportDto)
  create(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.reportsService.create(createReportDto, user);
  }

  @Patch(':id/approval')
  @UseGuards(AuthGuard, RoleGuard)
  async approveReport(
    @Param('id') id: string,
    @Body() approvalDto: ApprovalReportDto,
  ) {
    return await this.reportsService.approveReport(+id, approvalDto.approved);
  }

  @Get()
  async findAll() {
    return await this.reportsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reportsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    return await this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.reportsService.remove(+id);
  }
}
