from data.models.employee import WorkforceMetrics, Vacancy

class WorkforceRepository:
    '''Repository for workforce data'''
    
    async def get_workforce_metrics(self) -> WorkforceMetrics:
        '''Get current workforce metrics'''
        return WorkforceMetrics(
            total_employees=6200,
            departments={
                'R&D': 1450,
                'Sales': 2100,
                'Operations': 1800,
                'Support': 580,
                'G&A': 270
            },
            new_hires=12,
            turnover_rate=8.2,
            critical_vacancies=[
                Vacancy(role='VP of Clinical Affairs', days_open=52, location='Madison, WI', candidates=3),
                Vacancy(role='Director of Lab Operations', days_open=34, location='Phoenix, AZ', candidates=5),
                Vacancy(role='Regional Sales Director', days_open=28, location='New York, NY', candidates=8)
            ]
        )