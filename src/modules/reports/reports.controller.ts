import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleGuard } from 'src/guards/role.guard';
import { Serializer } from 'src/interceptors/serializer.interceptor';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { JwtAuthGuard } from '../../guards/auth.guard';
import { UserEntity } from '../users/entities/user.entity';
import { ApprovalReportDto } from './dto/approval-report.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { GetEstimateDto } from './dto/get-astimate.dto';
import { ReportDto } from './dto/report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Serializer(ReportDto)
  create(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.reportsService.create(createReportDto, user);
  }

  @Patch(':id/approval')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async approveReport(
    @Param('id') id: string,
    @Body() approvalDto: ApprovalReportDto,
  ) {
    return await this.reportsService.approveReport(+id, approvalDto.approved);
  }

  @Get('estimate')
  async getEstimate(@Query() getEstimateDto: GetEstimateDto) {
    return await this.reportsService.getEstimate(getEstimateDto);
  }

  @Get()
  @Serializer(ReportDto)
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
