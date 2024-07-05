import { Component, OnInit } from '@angular/core';
import { GroupService } from '../service/uefa/group.service';
import { Group } from '../model/group';
import { NgFor, SlicePipe } from '@angular/common';
import { share } from 'rxjs';

@Component({
  selector: 'app-groups-overview',
  standalone: true,
  imports: [NgFor, SlicePipe],
  templateUrl: './groups-overview.component.html',
  styleUrl: './groups-overview.component.css'
})
export class GroupsOverviewComponent implements OnInit {

  private competitionId = 3;
  private phase = 'TOURNAMENT';
  private seasonYear = 2024;

  groups: Group[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit(): void {
    this.getGroups();
  }

  getGroups() {
    this.groupService.retrieveGroups(this.competitionId, this.phase, this.seasonYear)
      .subscribe({
        next: (response: Group[]) => {
          console.log(response);
          this.groups = response;
        },
        error: (err: any) => {
          console.log(err);
          this.groups = [];
        }
      })
  }

  public get half(): number {
    return Math.ceil(this.groups.length / 2);
  }
}
