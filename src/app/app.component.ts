import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, } from "@angular/forms";
import { Icountry, Ihero } from './interfaces';
import { HeoresService } from './services/heoresService';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],

})
export class AppComponent implements OnInit {
  //for datepicker
  events: string[] = [];
  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }

  title = 'Heroes';
  FiltersForm!: FormGroup;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  public dataSource = new MatTableDataSource<Ihero>();
  //for sorting
  public dataSourcelength = 0;
  public retrivedData!: Ihero[];
  isExpanded: boolean = true;
  countries!: Icountry[];
  displayedColumns: string[] = ['name', 'phone', 'email', 'date', 'country', 'company'];

  constructor(private formBuilder: FormBuilder,
    private HeroService: HeoresService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Ihero>();
    this.initForm();
    this.getCountryList();
    this.getTableData();


  }
  //toggle filters div
  toggleFilters() {
    this.isExpanded = !this.isExpanded;
  }

  //get county list for ddl
  getCountryList() {
    this.HeroService.getCountries().subscribe(res => {
      if (res.IsSuccess) {
        this.countries = res.Response as Icountry[]
      }
    });
  }

  //intiate form
  initForm() {
    const EmailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    const PhonePattern = '[- +()0-9]+';
    this.FiltersForm = this.formBuilder.group({
      email: ['', [ Validators.pattern(EmailPattern)]],
      name: [''],
      phone:['', [Validators.pattern(PhonePattern)]],
      company: [''],
      country: [null],
      date:  [''],
    });
  }

  /**Search function */
  applySearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //get table data
  getTableData() {
    this.HeroService.getHeroList().subscribe(res => {
      if (res.IsSuccess) {
        this.retrivedData = res.Response as Ihero[];
        this.dataSource = new MatTableDataSource<Ihero>(this.retrivedData);
        //sorting
        this.dataSource.sort = this.sort;
        const sortState: Sort = { active: 'name', direction: 'asc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);
      }
    });
  }

//Filter section
ngAfterViewInit() {
 
}
FilterbyName(){
  this.dataSource.filterPredicate = function(data, filter: string): boolean {
    return (
      data.name.toString().includes(filter) 
    );
  };
}
}

