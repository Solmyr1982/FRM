using System.Collections.Generic;
using MySql.Data.MySqlClient;

namespace FRMDBCrawler
{

    public interface IFRMDBCrawler
    {
        string ReturnFiveRandomPhotos(string server, string database, string user, string password);
    }

    public class FRMDBCrawler
    {
        public string ReturnFiveRandomPhotos(string server, string database, string user, string password)
        {
            DBConnect DB = new DBConnect(server, database, user, password);
            List<string>[] list = new List<string>[2];
            list = DB.Select();

            string result = "";
            for (int i = 0; i < 5; i++)
            {
                result += list[0][i] + ';' + list[1][i].Substring(1) + ";";
            }

            return (result);
        }
    }

    class DBConnect
    {
        private MySqlConnection connection;
        private string server;
        private string database;
        private string uid;
        private string password;

        public DBConnect(string inServer, string inDatabase, string inUid, string inPassword)
        {
            server = inServer;
            database = inDatabase;
            uid = inUid;
            password = inPassword;
            Initialize();
        }

        private void Initialize()
        {
            string connectionString;
            connectionString = "SERVER=" + server + ";" + "DATABASE=" +
              database + ";" + "UID=" + uid + ";" + "PASSWORD=" + password + ";";
            connection = new MySqlConnection(connectionString);
        }

        private bool OpenConnection()
        {
            try
            {
                connection.Open();
                return true;
            }
            catch (MySqlException ex)
            {
                switch (ex.Number)
                {
                    case 0:
                        throw new System.InvalidOperationException("Cannot connect to server.  Contact administrator");

                    case 1045:
                        throw new System.InvalidOperationException("Invalid username/password, please try again");
                }
                return false;
            }
        }

        private bool CloseConnection()
        {
            try
            {
                connection.Close();
                return true;
            }
            catch (MySqlException ex)
            {
                throw new System.InvalidOperationException(ex.Message);
            }
        }

        public List<string>[] Select()
        {
            // https://stackoverflow.com/questions/4329396/mysql-select-10-random-rows-from-600k-rows-fast
            string query = "SELECT t1.id, path FROM `piwigo_images` AS t1 JOIN(SELECT id FROM `piwigo_images` ORDER BY RAND() LIMIT 5) as t2 ON t1.id = t2.id";

            List<string>[] list = new List<string>[2];
            list[0] = new List<string>();
            list[1] = new List<string>();

            if (this.OpenConnection() == true)
            {
                MySqlCommand cmd = new MySqlCommand(query, connection);
                MySqlDataReader dataReader = cmd.ExecuteReader();

                while (dataReader.Read())
                {
                    list[0].Add(dataReader["id"] + "");
                    list[1].Add(dataReader["path"] + "");
                }

                dataReader.Close();
                this.CloseConnection();
                return list;
            }
            else
            {
                return list;
            }
        }
    }
}
