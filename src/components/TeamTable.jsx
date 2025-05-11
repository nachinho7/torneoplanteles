import React, { useEffect, useState } from "react";
import {TORNEOS} from "./TorneoSelector";
import "../styles/TeamTable.css";

const TeamTable = ({torneo}) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

   // Buscar el nombre legible del torneo:
   const torneoNombre = Object.entries(TORNEOS).find(
    ([, value]) => value === torneo
  )?.[0] || "Torneo";

  useEffect(() => {
    const fetchTabla = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/por-equipo/${torneo}`);
        const data = await res.json();

        console.log("Datos recibidos:", data);

        if (data && typeof data === "object") {
          const teamsList = [];

          for (const teamName in data) {
            if (data.hasOwnProperty(teamName)) {
              const divisiones = data[teamName];

              let totalPoints = 0;
              const divisionPoints = {
                prim: "-",
                inter: "-",
                prea: "-",
                preb: "-",
                prec: "-",
                pred: "-",
              };

              // Variable para almacenar el valor de "jugados" de la división Superior.
              let superiorMatches = "-";

              for (const entry of divisiones) {
                const points = entry.ganados * 3 + entry.empatados;
                totalPoints += points;

                switch (entry.division) {
                  case "Superior":
                    divisionPoints.prim = points;
                    superiorMatches = entry.jugados;
                    break;
                  case "Intermedia":
                    divisionPoints.inter = points;
                    break;
                  case "Preintermedia A":
                    divisionPoints.prea = points;
                    break;
                  case "Preintermedia B":
                    divisionPoints.preb = points;
                    break;
                  case "Preintermedia C":
                    divisionPoints.prec = points;
                    break;
                  case "Preintermedia D":
                    divisionPoints.pred = points;
                    break;
                  default:
                    break;
                }
              }

              teamsList.push({
                name: teamName,
                points: totalPoints,
                fecha: superiorMatches, // Cantidad de partidos jugados en Superior.
                ...divisionPoints,
              });
            }
          }

          // Filtrar para eliminar el equipo "equipos" (en minúsculas o mayúsculas)
          const filteredTeams = teamsList.filter(
            (team) => team.name.toLowerCase().trim() !== "equipos"
          );

          // Ordenar por puntos totales (de mayor a menor)
          filteredTeams.sort((a, b) => b.points - a.points);
          setTeams(filteredTeams);
        } else {
          console.error("La estructura de los datos no es válida.");
        }
      } catch (error) {
        console.error("Error al cargar la tabla:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTabla();
  }, [torneo]);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <img className="loading" src={`/assets/icons/loading.gif`} alt="Cargando..." />
      </div>
    );
  }

  const superiorFecha = teams.find((team) => team.fecha !== "-")?.fecha || "-";

  return (
    <div className="table-container">
      <h2 className="table-title">Torneo de Planteles {torneoNombre}</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>PTS</th>
            <th>PRIM</th>
            <th>INTER</th>
            <th>PRE A</th>
            <th>PRE B</th>
            <th>PRE C</th>
            <th>PRE D</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index}>
              <td className="position-cell">{index + 1}°</td>
              <td className="team-cell">
                <img
                  src={`/assets/logos/${team.name.toLowerCase().replaceAll(" ", "")}.png`}
                  className="team-logo"
                  alt={team.name}
                />
                <span>{team.name}</span>
              </td>
              <td className="points-cell">{team.points}</td>
              <td>{team.prim}</td>
              <td>{team.inter}</td>
              <td>{team.prea}</td>
              <td>{team.preb}</td>
              <td>{team.prec}</td>
              <td>{team.pred}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <ul className="table-notes">
          <li>Todos los equipos valen lo mismo</li>
          <li>Cada victoria suma 3 puntos, Empate 1 y Derrota 0</li>
          <li>No incide el punto bonus</li>
        </ul>
        <div className="fecha-box">
          Fecha: {superiorFecha}
        </div>
      </div>
    </div>
  );
};

export default TeamTable;
