function Dashboard() {
  const token = localStorage.getItem("token");

  return (
    <div>
      <h2>Dashboard</h2>
      {token ? (
        <p>You are logged in 🎉</p>
      ) : (
        <p>Please login first</p>
      )}
    </div>
  );
}

export default Dashboard;
