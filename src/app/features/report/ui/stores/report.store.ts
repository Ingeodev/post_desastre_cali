import { signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';


type ReportsState = {
  reports: Report[];
  selectedReport: string | null,
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
};

const initialState: ReportsState = {
  reports: [],
  selectedReport: null,
  isLoading: false,
  filter: { query: '', order: 'asc' },
};

export const ReportStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({

  })),
  withMethods(({  ...store }) => ({
    async loadReports(): Promise<void> {

    },
  })),
  withHooks({
    onInit({  }) {
      console.log('BooksStore initialized');
    },
  })
);