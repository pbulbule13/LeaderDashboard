# CEO Dashboard Design - Enhanced with Meeting Suggestions

## Overview Page Structure

The overview page will serve as the main dashboard with high-level KPIs and quick links to detailed views.

### Dashboard Tiles Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    HEALTHCARE SCIENCES CEO DASHBOARD             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Order Volume │ │  Financial   │ │   Operating  │            │
│  │  & Growth    │ │     KPIs     │ │     Costs    │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Reimbursement│ │  Compliance  │ │     Lab      │            │
│  │   Metrics    │ │  & Returns   │ │   Metrics    │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │  Regional    │ │  Forecasting │ │   Market     │            │
│  │ Performance  │ │              │ │ Intelligence │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │   Project    │ │    Stock     │ │   Products   │            │
│  │  Milestones  │ │    Price     │ │   Overview   │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Tile Specifications

### 1. Order Volume & Growth Dashboard
**Agent**: `OrderVolumeAgent`
**Model**: `OrderVolume`
**Data Points**:
- Total orders (day, week, month, quarter, year)
- Growth metrics (YoY, QoQ, MoM, WoW, DoD)
- Product line breakdown (Cologuard, MRD, PO, etc.)
- Trend visualizations

### 2. Compliance & Returns Dashboard
**Agent**: `ComplianceAgent`
**Model**: `ComplianceMetrics`
**Data Points**:
- Kit return counts by product
- Return rates (%)
- Comparison to total orders
- Reasons for returns

### 3. Reimbursement Metrics Dashboard
**Agent**: `ReimbursementAgent`
**Model**: `ReimbursementMetrics`
**Data Points**:
- % orders reimbursed
- % rejected claims
- Rejection reasons breakdown
- Insurance eligibility issues
- Prior procedure conflicts

### 4. Financial KPIs/Revenue Dashboard
**Agent**: `RevenueAgent` (Enhanced)
**Model**: `Revenue` (Enhanced)
**Data Points**:
- Revenue by period (monthly, quarterly)
- Revenue by product line
- Revenue trends
- Comparison to targets

### 5. Operating Costs Dashboard
**Agent**: `OperatingCostsAgent`
**Model**: `OperatingCosts`
**Data Points**:
- AWS/Cloud costs
- Salary expenses
- Lab/Facility costs
- Total operating costs
- Cost trends
- Major cost drivers

### 6. Lab Metrics Dashboard
**Agent**: `LabMetricsAgent`
**Model**: `LabMetrics`
**Data Points**:
- Processing volumes
- Turnaround time (order-to-completion)
- Efficiency metrics
- Capacity utilization
- Quality metrics

### 7. Regional/Territory Performance Dashboard
**Agent**: `RegionalAgent`
**Model**: `RegionalPerformance`
**Data Points**:
- Orders by territory (Northeast, Northwest, etc.)
- Revenue by region
- Growth by territory
- Map visualization
- Performance comparisons

### 8. Forecasting Dashboard
**Agent**: `ForecastingAgent`
**Model**: `Forecast`
**Data Points**:
- Projected orders (based on historicals)
- Projected revenue
- Confidence intervals
- Trend projections

### 9. Market Intelligence Dashboard
**Agent**: `MarketIntelligenceAgent`
**Model**: `MarketIntelligence`
**Data Points**:
- Healthcare industry news
- Competitor updates
- Regulatory changes
- Product launches
- Industry trends

### 10. Security/Role-based Access
**Implementation**: Middleware
- CEO/CFO restricted views
- Role-based permissions
- Audit logging

### 11. Project Milestone Tracking
**Agent**: `MilestonesAgent`
**Model**: `ProjectMilestone`
**Data Points**:
- Major project status
- FDA submission milestones
- High-level progress (not granular tasks)
- Timeline visualization

### 12. Stock Price Tracking (Optional)
**Agent**: `StockAgent` (Enhanced)
**Model**: `Stock` (Enhanced)
**Data Points**:
- Current stock price
- Daily change
- Historical trends
- Market indicators

### 13. Products Overview (Existing)
**Agent**: `ProductsAgent` (Enhanced)
- Maintain existing functionality
- Link to Order Volume dashboard

### 14. Support/Workforce (Existing)
**Agent**: `SupportAgent`, `WorkforceAgent`
- Keep existing tiles

### 15. Budget (Existing)
**Agent**: `BudgetAgent`
- Integrate with Operating Costs

## API Endpoints Structure

```
GET /api/dashboard/overview
    → Returns all tiles summary

GET /api/dashboard/tiles/orders-volume
    → Order Volume & Growth details

GET /api/dashboard/tiles/compliance
    → Compliance & Returns details

GET /api/dashboard/tiles/reimbursement
    → Reimbursement metrics

GET /api/dashboard/tiles/financial
    → Financial KPIs (enhanced revenue)

GET /api/dashboard/tiles/operating-costs
    → Operating costs breakdown

GET /api/dashboard/tiles/lab-metrics
    → Lab performance metrics

GET /api/dashboard/tiles/regional
    → Regional/Territory performance

GET /api/dashboard/tiles/forecasting
    → Forecasting data

GET /api/dashboard/tiles/market-intelligence
    → Market intelligence feed

GET /api/dashboard/tiles/milestones
    → Project milestones

GET /api/dashboard/tiles/stock (existing, enhanced)
GET /api/dashboard/tiles/products (existing, enhanced)
GET /api/dashboard/tiles/support (existing)
GET /api/dashboard/tiles/workforce (existing)
GET /api/dashboard/tiles/budget (existing)
```

## Implementation Order

1. Create all data models
2. Create all repositories with mock data
3. Create all agents
4. Update API routes
5. Create overview endpoint
6. Add role-based security
7. Testing

## Notes

- All new tiles will have mock data initially
- Each tile links to detailed view
- Overview page shows KPIs only
- Role-based access controls sensitive data
- Market Intelligence may require external API integration
