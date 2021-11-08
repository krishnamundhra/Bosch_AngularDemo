import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';

export class Task {
  constructor(
    public id: number,
    public taskname: string,
    public project: string,
    public comments: string,
  ) {
  }
}

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  editForm!: FormGroup;
  addForm: any;
  tasks: any;
  deleteID: any;

  constructor(private httpClient: HttpClient, private modalService: NgbModal, private formBuilder: FormBuilder) { }

    ngOnInit(): void {
      this.getTasks();
      this.editForm = this.formBuilder.group({
        id: [''],
        taskname: [''],
        project: [''],
        comments: ['']
      } );
    }

  getTasks(){
    this.httpClient.get<any>('http://localhost:4200/assets/data.json').subscribe(
      response => {
        console.log(response);
        this.tasks = response;
      }
    );
  }



//Add
openAdd(targetModal: any) {
  this.modalService.open(targetModal, {
    backdrop: 'static',
    size: 'lg'
  });
}

onSubmit(f: NgForm) {
  const url = 'http://localhost:4200/tasks/addnew';
  this.httpClient.post(url, f.value)
    .subscribe((result) => {
      this.ngOnInit(); //reload the table
    });
  this.modalService.dismissAll(); //dismiss the modal
}

// For Reference - Create Tasks API endpoint

// @PostMapping("/tasks/addnew")
// public void addTask(@RequestBody Task task){
//     taskService.save(task);
// }



//Edit
openEdit(targetModal: any, task: Task) {
  this.modalService.open(targetModal, {
    backdrop: 'static',
    size: 'lg'
  });
  this.editForm.patchValue( {
    id: task.id, 
    taskname: task.taskname,
    project: task.project,
    comments: task.comments
  });
}

onSave() {
  const editURL = 'http://localhost:4200/assets/data.json' + this.editForm.value.id + '/edit';
  console.log(this.editForm.value);
  this.httpClient.put(editURL, this.editForm.value)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
}

// Delete
openDelete(targetModal: any, task: Task) {
  const deleteId = task.id;
  this.modalService.open(targetModal, {
    backdrop: 'static',
    size: 'lg'
  });
}

onDelete() {
  const deleteURL = 'http://localhost:4200/assets/data.json/' + this.deleteID + '/delete';
  this.httpClient.delete(deleteURL)
    .subscribe((results) => {
      this.ngOnInit();
      this.modalService.dismissAll();
    });
 }
}

//  For References as API creation not done at backend
// Delete API Mapping 
 
//  @DeleteMapping("/tasks/{id}/delete")
// public void deleteTask(@PathVariable("id") Integer id){
//     taskService.delete(id);
// }

