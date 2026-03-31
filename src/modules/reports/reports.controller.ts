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
import { CurrentUser } from '../users/decorator/current-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportDto } from './dto/report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';

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

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
