using MySql.Data.MySqlClient;

namespace AZimpleWeb.Services
{
    public abstract class DatabaseConsumer
    {
        protected string ConnectionString;

        public DatabaseConsumer(string connectionString)
        {
            this.ConnectionString = connectionString;
        }

        protected MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }
    }
}