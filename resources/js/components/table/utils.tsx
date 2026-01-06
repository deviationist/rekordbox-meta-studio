export const displayValue = (value: any, children?: (value: any) => React.ReactNode) => {
  if (value) {
    return children ? children(value) : (
      <div className="font-medium truncate" title={value}>
        {value}
      </div>
    );
  }
  return <span className="text-muted-foreground">-</span>;
};
