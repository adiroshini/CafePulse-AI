export const DEMO_BUSINESS = {
  id: 'demo-business-1',
  cafe_name: "Ravi's Coffee House",
  location: 'Hyderabad, Telangana',
  business_type: 'Café',
  num_employees: 6,
  operating_hours: '8 AM – 10 PM',
};

export const DEMO_DASHBOARD = {
  health_score: 62,
  avg_rating: 3.4,
  total_revenue: 184500,
  revenue_trend_pct: -18,
  top_complaint: 'waiting_time',
  top_strength: 'coffee_quality',
  at_risk_customer_count: 12,
  risk_level: 'Medium',
  cafe_name: "Ravi's Coffee House",
  location: 'Hyderabad, Telangana',
  last_analysis: '2024-06-10',
};

export const DEMO_REVIEWS = [
  { source: 'google', rating: 2, text: 'Waiting time is too long, waited 25 minutes for a simple coffee. Very disappointing.', date: '2024-06-07', customer_name: 'Priya S' },
  { source: 'zomato', rating: 3, text: 'Staff was rude and impolite when I asked about the delay. Not a great experience.', date: '2024-06-06', customer_name: 'Arjun K' },
  { source: 'swiggy', rating: 5, text: 'Amazing coffee quality! Best espresso in the city. Loved the cozy ambience.', date: '2024-06-05', customer_name: 'Sunita R' },
  { source: 'google', rating: 4, text: 'Great ambience and very clean place. Coffee is excellent as always!', date: '2024-06-05', customer_name: 'Venkat M' },
  { source: 'manual', rating: 2, text: 'Food was cold when served. The temperature was completely wrong.', date: '2024-06-04', customer_name: 'Deepa T' },
  { source: 'google', rating: 1, text: 'Long wait, slow service, will not come again. Very disappointed overall.', date: '2024-06-04', customer_name: 'Rahul P' },
  { source: 'zomato', rating: 5, text: 'Friendly staff and absolutely delicious food! Coffee quality is amazing.', date: '2024-06-03', customer_name: 'Ananya B' },
  { source: 'google', rating: 2, text: 'Waited 30 minutes, staff seemed confused. Coffee was cold when served.', date: '2024-06-02', customer_name: 'Kiran D' },
  { source: 'swiggy', rating: 4, text: 'The ambience is really nice and coffee quality is top-notch!', date: '2024-06-01', customer_name: 'Meena V' },
  { source: 'google', rating: 3, text: 'Average experience. Service is slow but the coffee makes up for it.', date: '2024-06-01', customer_name: 'Sanjay P' },
];

export const DEMO_REVENUE = {
  daily_revenue: [
    { date: '2024-06-10', revenue: 9200, orders: 46 },
    { date: '2024-06-09', revenue: 8700, orders: 43 },
    { date: '2024-06-08', revenue: 11200, orders: 56 },
    { date: '2024-06-07', revenue: 7800, orders: 39 },
    { date: '2024-06-06', revenue: 6500, orders: 32 },
    { date: '2024-06-05', revenue: 9900, orders: 49 },
    { date: '2024-06-04', revenue: 8100, orders: 40 },
  ],
  product_performance: [
    { product: 'Cappuccino', revenue: 52000, units_sold: 260 },
    { product: 'Latte', revenue: 38000, units_sold: 190 },
    { product: 'Cold Coffee', revenue: 28000, units_sold: 140 },
    { product: 'Espresso', revenue: 22000, units_sold: 110 },
    { product: 'Brownie', revenue: 18000, units_sold: 180 },
    { product: 'Sandwich', revenue: 14000, units_sold: 70 },
    { product: 'Croissant', revenue: 8500, units_sold: 85 },
    { product: 'Green Tea', revenue: 4000, units_sold: 40 },
  ],
};

export const DEMO_INVENTORY = [
  { ingredient: 'Coffee Beans', stock_level: 2.5, reorder_level: 5, unit: 'kg', purchase_cost: 800, is_low: true },
  { ingredient: 'Milk', stock_level: 8, reorder_level: 10, unit: 'liters', purchase_cost: 60, is_low: true },
  { ingredient: 'Sugar', stock_level: 12, reorder_level: 3, unit: 'kg', purchase_cost: 50, is_low: false },
  { ingredient: 'Flour', stock_level: 15, reorder_level: 5, unit: 'kg', purchase_cost: 45, is_low: false },
  { ingredient: 'Butter', stock_level: 1.2, reorder_level: 2, unit: 'kg', purchase_cost: 500, is_low: true },
  { ingredient: 'Chocolate Syrup', stock_level: 3, reorder_level: 2, unit: 'liters', purchase_cost: 350, is_low: false },
  { ingredient: 'Vanilla Extract', stock_level: 0.3, reorder_level: 0.5, unit: 'liters', purchase_cost: 900, is_low: true },
];

export const DEMO_MENU = {
  best_sellers: [
    { product: 'Cappuccino', total_revenue: 52000, total_units: 260, revenue_share_pct: 28.3 },
    { product: 'Latte', total_revenue: 38000, total_units: 190, revenue_share_pct: 20.7 },
    { product: 'Cold Coffee', total_revenue: 28000, total_units: 140, revenue_share_pct: 15.2 },
  ],
  low_sellers: [
    { product: 'Green Tea', total_revenue: 4000, total_units: 40, revenue_share_pct: 2.2 },
    { product: 'Croissant', total_revenue: 8500, total_units: 85, revenue_share_pct: 4.6 },
  ],
  all_products: [
    { product: 'Cappuccino', total_revenue: 52000, total_units: 260, revenue_share_pct: 28.3 },
    { product: 'Latte', total_revenue: 38000, total_units: 190, revenue_share_pct: 20.7 },
    { product: 'Cold Coffee', total_revenue: 28000, total_units: 140, revenue_share_pct: 15.2 },
    { product: 'Espresso', total_revenue: 22000, total_units: 110, revenue_share_pct: 12.0 },
    { product: 'Brownie', total_revenue: 18000, total_units: 180, revenue_share_pct: 9.8 },
    { product: 'Sandwich', total_revenue: 14000, total_units: 70, revenue_share_pct: 7.6 },
    { product: 'Croissant', total_revenue: 8500, total_units: 85, revenue_share_pct: 4.6 },
    { product: 'Green Tea', total_revenue: 4000, total_units: 40, revenue_share_pct: 2.2 },
  ],
  combo_suggestions: [
    { combo: 'Cappuccino + Brownie', estimated_uplift: '+12% avg order value' },
    { combo: 'Latte + Croissant', estimated_uplift: '+10% avg order value' },
    { combo: 'Cold Coffee + Sandwich', estimated_uplift: '+14% avg order value' },
  ],
};

export const DEMO_COMBOS = [
  { combo_name: 'Cappuccino + Brownie Combo', items: ['Cappuccino', 'Brownie'], type: 'Bundle Discount', suggested_discount: '10-15%', estimated_revenue_uplift: '+12% average order value', upsell_opportunity: 'Suggest Brownie when customer orders Cappuccino' },
  { combo_name: 'Latte + Croissant Combo', items: ['Latte', 'Croissant'], type: 'Bundle Discount', suggested_discount: '10%', estimated_revenue_uplift: '+10% average order value', upsell_opportunity: 'Suggest Croissant when customer orders Latte' },
  { combo_name: 'Cold Coffee + Sandwich Combo', items: ['Cold Coffee', 'Sandwich'], type: 'Bundle Discount', suggested_discount: '12%', estimated_revenue_uplift: '+14% average order value', upsell_opportunity: 'Suggest Sandwich when customer orders Cold Coffee' },
];

export const DEMO_EXPERIMENTS = [
  { id: 'exp-1', product: 'Green Tea', type: 'sampling', description: 'Offer free sample of Green Tea with every coffee order', status: 'active', result: null, created_at: '2024-06-01' },
  { id: 'exp-2', product: 'Croissant', type: 'combo', description: 'Bundle Croissant with Latte at a discounted price', status: 'completed', result: 'keep', created_at: '2024-05-20' },
  { id: 'exp-3', product: 'Brownie', type: 'pricing', description: 'Reduce price of Brownie from ₹120 to ₹99', status: 'completed', result: 'keep', created_at: '2024-05-15' },
];

export const DEMO_AT_RISK = [
  { customer: 'Priya S', low_ratings: 3, recent_complaints: ['Waiting time too long', 'Cold food'] },
  { customer: 'Rahul P', low_ratings: 2, recent_complaints: ['Slow service', 'Rude staff'] },
  { customer: 'Kiran D', low_ratings: 2, recent_complaints: ['30 min wait', 'Cold coffee'] },
  { customer: 'Deepa T', low_ratings: 2, recent_complaints: ['Food temperature issue'] },
];

export const DEMO_RECOMMENDATIONS = [
  { action: 'Add one employee during lunch rush hours (12 PM – 2 PM)', expected_revenue_impact: '+8-12%', expected_rating_improvement: '+0.4 stars', expected_complaint_reduction: '-35%', priority: 'High' },
  { action: 'Pre-prepare ingredients before peak hours to reduce waiting time', expected_revenue_impact: '+5%', expected_rating_improvement: '+0.2 stars', expected_complaint_reduction: '-20%', priority: 'High' },
  { action: 'Send loyalty reward / free coffee coupon to 12 at-risk customers', expected_revenue_impact: '+3-5% retention', expected_rating_improvement: '+0.3 stars', expected_complaint_reduction: '-10%', priority: 'Medium' },
  { action: 'Launch BOGO promotion on weekdays to boost slow-day revenue', expected_revenue_impact: '+15-20%', expected_rating_improvement: 'Neutral', expected_complaint_reduction: 'Neutral', priority: 'Medium' },
  { action: 'Create combo bundle: Cappuccino + Brownie at 10% discount', expected_revenue_impact: '+10%', expected_rating_improvement: '+0.1 stars', expected_complaint_reduction: 'Neutral', priority: 'Medium' },
  { action: 'Restock low inventory: Coffee Beans, Milk, Butter, Vanilla Extract', expected_revenue_impact: 'Prevent revenue loss', expected_rating_improvement: '+0.2 stars', expected_complaint_reduction: '-15%', priority: 'High' },
];

export const DEMO_ACTIONS = [
  { id: 'act-1', recommendation: 'Add one employee during lunch rush hours', category: 'staffing', status: 'pending', created_at: '2024-06-10' },
  { id: 'act-2', recommendation: 'Restock Coffee Beans and Milk', category: 'inventory', status: 'yes', impact_notes: 'Stock refilled, no disruption since', created_at: '2024-06-08' },
  { id: 'act-3', recommendation: 'Launch BOGO promotion on weekdays', category: 'promotion', status: 'partially', impact_notes: 'Ran on Tuesday only', created_at: '2024-06-05' },
];
