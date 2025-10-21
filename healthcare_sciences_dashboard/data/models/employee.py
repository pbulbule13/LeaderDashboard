from pydantic import BaseModel

class Vacancy(BaseModel):
    role: str
    days_open: int
    location: str
    candidates: int

class WorkforceMetrics(BaseModel):
    total_employees: int
    departments: dict[str, int]
    new_hires: int
    turnover_rate: float
    critical_vacancies: list[Vacancy]