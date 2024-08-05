import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, Observable, of, startWith } from "rxjs";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

type LoadingState<T> = Loading | Loaded<T> | Errored;

interface Loading {
  status: "loading";
}

interface Loaded<T> {
  status: "success";
  data: T;
}

interface Errored {
  status: "error";
  error: any;
}

@Component({
  selector: "app-home",
  standalone: true,
  imports: [],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {
  private http = inject(HttpClient);

  items = toSignal(this.getTodos(), {
    initialValue: { status: "loading" },
  });

  private getTodos(): Observable<LoadingState<Todo[]>> {
    return this.http.get<Todo[]>("/api/todos").pipe(
      map((data) => ({ status: "success", data }) as Loaded<Todo[]>),
      startWith({ status: "loading" } as Loading),
      catchError((error) => of({ status: "error", error } as Errored)),
    );
  }
}
