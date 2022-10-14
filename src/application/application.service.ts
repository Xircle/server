import { UserRepository } from '@user/repositories/user.repository';
import { TeamRepository } from './../team/repository/team.repository';
import { EditApplicationInput } from './dtos/edit-application.dto';
import { CreateApplicationInput } from './dtos/create-application.dto';
import { User } from '@user/entities/user.entity';
import { CoreOutput } from './../common/common.interface';
import { ApplicationRepository } from './repositories/application.repository';
import { Injectable } from '@nestjs/common';
import { ApplicationStatus } from './entities/application.entity';
import { Not } from 'typeorm';
import { GetApplicationByLeaderOutput } from './dtos/get-application-by-leader.dto';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async createApplication(
    authUser: User,
    { teamId }: CreateApplicationInput,
  ): Promise<CoreOutput> {
    try {
      if (!authUser.profile.isYkClub) {
        return { ok: false, error: '현기수에 등록되어있지 않습니다' };
      }
      const exists = await this.applicationRepository.findOne({
        where: {
          team_id: teamId,
          user_id: authUser.id,
        },
      });
      if (exists && !exists.isCanceled) {
        return {
          ok: false,
          error: '이미 신청하셨습니다.',
        };
      }
      if (exists) {
        await this.applicationRepository.update(
          {
            user_id: authUser.id,
            team_id: teamId,
          },
          {
            isCanceled: false,
          },
        );
      } else {
        const application = this.applicationRepository.create({
          team_id: teamId,
          user_id: authUser.id,
          image: authUser.profile.profileImageUrl,
          gender: authUser.profile.gender,
        });
        await this.applicationRepository.save(application);
      }

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error };
    }
  }

  async getApplicationByLeader(
    authUser: User,
    applicationId: string,
  ): Promise<GetApplicationByLeaderOutput> {
    try {
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async editApplication(
    editApplicationInput: EditApplicationInput,
  ): Promise<CoreOutput> {
    try {
      const exists = await this.applicationRepository.findOne({
        where: {
          id: editApplicationInput.applicationId,
        },
        relations: ['team'],
      });
      if (!exists) {
        return { ok: false, error: '지원서가 존재하지 않아요' };
      }
      if (
        editApplicationInput.status === ApplicationStatus.Approved ||
        editApplicationInput.status === ApplicationStatus.Enrolled
      ) {
        const genderCount = await this.applicationRepository.findAndCount({
          where: {
            team_id: exists.team_id,
            status: ApplicationStatus.Approved,
            gender: exists.gender,
          },
        });
        console.log(genderCount[1]);
        if (genderCount[1] > exists.team.maxParticipant / 2) {
          return { ok: false, error: '특정 성비가 절반을 넘을 수 없습니다' };
        }

        const count = await this.applicationRepository.findAndCount({
          where: {
            team_id: exists.team_id,
            status: ApplicationStatus.Approved,
          },
        });
        if (count[1] >= exists.team.maxParticipant) {
          return { ok: false, error: '인원이 꽉 찼습니다' };
        }
      }

      await this.applicationRepository.update(
        {
          id: editApplicationInput.applicationId,
        },
        {
          status:
            editApplicationInput.status !== undefined &&
            editApplicationInput.status !== null
              ? editApplicationInput.status
              : exists.status,
          isCanceled:
            editApplicationInput.isCanceled === undefined ||
            editApplicationInput.isCanceled === null
              ? exists.isCanceled
              : editApplicationInput.isCanceled?.toLowerCase() === 'true',
          paid:
            editApplicationInput.paid === undefined ||
            editApplicationInput.paid === null
              ? exists.paid
              : editApplicationInput.paid?.toLowerCase() === 'true',
        },
      );
      if (editApplicationInput.status === ApplicationStatus.Approved) {
        await this.userRepository.update(
          {
            id: exists.user_id,
          },
          {
            team_id: exists.team_id,
          },
        );
        // approved 시 다 켄슬하기
        await this.applicationRepository.update(
          {
            user_id: exists.user_id,
            team_id: Not(exists.team_id),
          },
          { isCanceled: true },
        );
      }

      return { ok: true };
    } catch (error) {
      return { ok: false, error };
    }
  }
}
