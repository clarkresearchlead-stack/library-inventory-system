interface DashboardCardProps {
  title: string;
  value: number | string;
  description?: string;
}

const DashboardCard = ({ title, value, description }: DashboardCardProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};

export default DashboardCard;