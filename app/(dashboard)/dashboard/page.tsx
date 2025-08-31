import MetricsOverview from "./_parts/MetricsOverview";
import StreamsChart from "./_parts/StreamsChart";
import PaymentsPie from "./_parts/PaymentsPie";
import AlertsPanel from "./_parts/AlertsPanel";
import TransactionsTable from "./_parts/TransactionsTable";
import TimeseriesChart from "./_parts/TimeseriesChart";
import DateRangePicker from "./_parts/DateRangePicker";

export default function DashboardHome() {
	return (
		<div className="space-y-6">
			<MetricsOverview />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<StreamsChart />
				<PaymentsPie />
			</div>
			<div className="pt-4 text-sm text-gray-500">Role: Owner</div>
				<DateRangePicker />
			<TimeseriesChart />
			<AlertsPanel />
			<TransactionsTable />
		</div>
	);
}

