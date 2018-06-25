using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using Microsoft.Extensions.DependencyInjection;
using MySql.Data.MySqlClient;

using AZimpleWeb.Models;

namespace AZimpleWeb.Services
{
    public class AuthService : DatabaseConsumer
    {
        private List<RealmInfo> realms = new List<RealmInfo>();

        public AuthService(string connString) : base(connString) {}

        public List<GameAccount> GetAllAccounts()
        {
            List<GameAccount> accounts = new List<GameAccount>();

            using (MySqlConnection conn = GetConnection())
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT * FROM account LIMIT 100";
                conn.Open();

                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        accounts.Add(new GameAccount {
                            Username = reader.GetString("username"),
                            Email = reader.GetString("email")
                        });
                    }
                }
            }

            return accounts;
        }

        public bool CreateAccount(string username, string password, string email = "")
        {
            Regex regex = new Regex(@"(\W)");
            username = regex.Replace(username, "");

            if (password.Length > 16)
            {
                password = password.Substring(0, 15);
            }

            byte[] passBytes = Encoding.ASCII.GetBytes(username.ToUpper() + ":" + password);
            var crypto = System.Security.Cryptography.SHA1.Create();
            var hashBytes = crypto.ComputeHash(passBytes);
            var hashedPass = BitConverter.ToString(hashBytes).Replace("-", "");

            using (MySqlConnection conn = GetConnection())
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "INSERT INTO account(username, sha_pass_hash, email, expansion, joindate) VALUES(@username, @password, @email, 2, NOW())";
                cmd.Parameters.AddWithValue("@username", username.ToLower());
                cmd.Parameters.AddWithValue("@password", hashedPass);
                cmd.Parameters.AddWithValue("@email", email);
                try
                {
                    conn.Open();
                    return cmd.ExecuteNonQuery() > 0;
                }
                catch (MySqlException ex)
                {
                    Console.WriteLine("[ERROR] {0} : {1}", ex.Source, ex.Message);
                }
            }

            return false;
        }

        public GameAccount GetGameAccountByName(string username)
        {
            using (MySqlConnection conn = GetConnection())
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT username, email FROM account WHERE username = @username";
                cmd.Parameters.AddWithValue("@username", username.ToLower());
                conn.Open();
                
                DataTable data = new DataTable();
                data.Load(cmd.ExecuteReader());
                if (data.Rows.Count > 0) {
                    return new GameAccount {
                        Username = data.Rows[0]["username"].ToString(),
                        Email = data.Rows[0]["email"].ToString()
                    };
                } else {
                    return null;
                }
            }
        }

        public void AddRealm(int id, string connString)
        {
            using (MySqlConnection conn = GetConnection())
            {
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT id, name, icon, flag, gamebuild FROM realmlist WHERE id = @id";
                cmd.Parameters.AddWithValue("@id", id);
                conn.Open();

                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        RealmInfo realm = new RealmInfo(connString) {
                            Id = id,
                            Name = reader.GetString("name"),
                            Type = RealmInfo.GetRealmType(reader.GetInt16("icon")),
                            Flags = reader.GetInt16("flag"),
                            GameBuild = reader.GetInt32("gamebuild")
                        };

                        realms.Add(realm);
                    } else {
                        throw new ArgumentException($"Invalid Id {id}. That realm doesn't exists.");
                    }
                }
            }
        }

        public RealmInfo GetRealm(int id)
        {
            return realms.Find(r => r.Id == id);
        }
        public List<RealmInfo> GetRealmList()
        {
            return realms;
        }
    }
}