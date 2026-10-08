import React, { useState } from 'react';
import { AppUser, UserRole } from '../types/scada';

interface UsersRbacViewProps {
  currentUser: AppUser;
  onSwitchUser: (user: AppUser) => void;
  triggerToast: (msg: string) => void;
}

const initialUsers: AppUser[] = [
  {
    id: 'usr-001',
    nombre: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@ecopetrol.com.co',
    rol: 'OPERADOR',
    cargo: 'Operador Senior RTOC',
    badge: 'ECO-RTOC-9402',
    activo: true,
    creadoEn: '2024-03-15',
    ultimoAcceso: 'Activo ahora (Turno A)',
  },
  {
    id: 'usr-002',
    nombre: 'Ing. Elena Vargas',
    email: 'elena.vargas@ecopetrol.com.co',
    rol: 'ADMIN',
    cargo: 'Jefe de Planta & Operaciones Rubiales',
    badge: 'ECO-DIR-1004',
    activo: true,
    creadoEn: '2023-11-01',
    ultimoAcceso: 'Hace 12 min',
  },
  {
    id: 'usr-003',
    nombre: 'Dr. Roberto Gómez',
    email: 'roberto.gomez@ecopetrol.com.co',
    rol: 'AUDITOR',
    cargo: 'Auditor de Integridad Operacional & HSE',
    badge: 'ECO-AUD-5521',
    activo: true,
    creadoEn: '2024-01-20',
    ultimoAcceso: 'Hoy 08:30',
  },
  {
    id: 'usr-004',
    nombre: 'Javier Silva',
    email: 'javier.silva@ecopetrol.com.co',
    rol: 'OPERADOR',
    cargo: 'Operador de Turno Patio / Manifolds',
    badge: 'ECO-RTOC-8820',
    activo: true,
    creadoEn: '2024-05-10',
    ultimoAcceso: 'Ayer 18:00',
  },
  {
    id: 'usr-005',
    nombre: 'Diana Castro',
    email: 'diana.castro@ecopetrol.com.co',
    rol: 'AUDITOR',
    cargo: 'Especialista de Normativa MinEnergía',
    badge: 'ECO-AUD-7730',
    activo: false,
    creadoEn: '2024-02-14',
    ultimoAcceso: 'Inactivo por Administrador',
  },
];

export const UsersRbacView: React.FC<UsersRbacViewProps> = ({
  currentUser,
  onSwitchUser,
  triggerToast,
}) => {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [newNombre, setNewNombre] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRol, setNewRol] = useState<UserRole>('OPERADOR');
  const [newCargo, setNewCargo] = useState('');

  const isAdmin = currentUser.rol === 'ADMIN';

  const handleToggleActive = (userId: string) => {
    if (!isAdmin) {
      triggerToast('Acceso denegado: Solo el Administrador/Jefe de Planta puede activar o desactivar usuarios (PRD 3.3).');
      return;
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newState = !u.activo;
          triggerToast(
            newState
              ? `Usuario ${u.nombre} reactivado exitosamente.`
              : `Bloqueo inmediato: Usuario ${u.nombre} desactivado (Tokens JWT revocados).`
          );
          return { ...u, activo: newState, ultimoAcceso: newState ? 'Reactivado' : 'Bloqueado por Admin' };
        }
        return u;
      })
    );
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (!isAdmin) {
      triggerToast('Acceso denegado: Solo el Administrador puede modificar roles RBAC.');
      return;
    }
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          triggerToast(`Rol de ${u.nombre} actualizado a ${newRole}.`);
          return { ...u, rol: newRole };
        }
        return u;
      })
    );
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre || !newEmail || !newCargo) {
      alert('Por favor complete todos los campos.');
      return;
    }
    const newUser: AppUser = {
      id: `usr-${String(users.length + 1).padStart(3, '0')}`,
      nombre: newNombre,
      email: newEmail,
      rol: newRol,
      cargo: newCargo,
      badge: `ECO-${newRol.slice(0, 3)}-${Math.floor(Math.random() * 8000 + 1000)}`,
      activo: true,
      creadoEn: new Date().toISOString().split('T')[0],
      ultimoAcceso: 'Registrado',
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    setNewNombre('');
    setNewEmail('');
    setNewCargo('');
    triggerToast(`Usuario ${newUser.nombre} aprovisionado con rol ${newUser.rol}.`);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-12 space-y-6 text-[#dfe2ee]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-xl bg-[#111827]/90 shadow-xl border border-white/5">
        <div>
          <div className="flex items-center gap-1.5 text-[#00B042] font-mono text-[10px] tracking-widest font-semibold uppercase">
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
            <span>MÓDULO DE GESTIÓN DE ROLES Y ACCESOS (RBAC) • PRD 3.3</span>
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight mt-0.5">
            Usuarios, Roles y Permisos RBAC
          </h1>
          <p className="text-xs text-[#bccbb8]">
            Control granular de privilegios según tabla de la base de datos Supabase / PostgreSQL (<code className="font-mono text-[#06B6D4]">usuarios</code>).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#1c2028] border border-white/5 font-mono text-xs flex items-center gap-2">
            <span className="text-[#869583]">SESIÓN ACTUAL:</span>
            <span className="text-white font-bold">{currentUser.nombre}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              currentUser.rol === 'ADMIN'
                ? 'bg-[#EF4444]/20 text-[#EF4444]'
                : currentUser.rol === 'OPERADOR'
                ? 'bg-[#00B042]/20 text-[#00B042]'
                : 'bg-[#7bd0ff]/20 text-[#7bd0ff]'
            }`}>
              {currentUser.rol}
            </span>
          </div>

          <button
            onClick={() => {
              if (!isAdmin) {
                triggerToast('Acceso denegado: Solo usuarios con rol ADMIN pueden registrar nuevos operadores.');
                return;
              }
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00B042] hover:bg-[#52e16c] text-[#0B0F17] text-xs font-mono font-bold shadow-md transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            <span>+ Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* RBAC MATRIX EXPLAINER (PRD 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Admin Card */}
        <div className="p-4 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#EF4444]">shield_person</span>
              <h3 className="text-sm font-bold text-white">ADMIN / Jefe de Planta</h3>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] font-bold">
              CONTROL TOTAL
            </span>
          </div>
          <p className="text-xs text-[#bccbb8]">
            Gestión completa de usuarios y roles; parametrización de umbrales operacionales HH/H/L/LL; visualización global y auditoría de eventos inmutables.
          </p>
          <div className="pt-2 border-t border-white/5 font-mono text-[10px] text-[#869583]">
            @PreAuthorize("hasRole('ADMIN')")
          </div>
        </div>

        {/* Operator Card */}
        <div className="p-4 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00B042]">engineering</span>
              <h3 className="text-sm font-bold text-white">OPERADOR / Analista</h3>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00B042]/15 text-[#00B042] font-bold">
              SUPERVISIÓN ACTIVA
            </span>
          </div>
          <p className="text-xs text-[#bccbb8]">
            Lectura en tiempo real; gestión, atención y cierre de alertas con justificación técnica obligatoria (min. 20 caracteres); registro de intervenciones en bitácora.
          </p>
          <div className="pt-2 border-t border-white/5 font-mono text-[10px] text-[#869583]">
            @PreAuthorize("hasAnyRole('OPERADOR', 'ADMIN')")
          </div>
        </div>

        {/* Auditor Card */}
        <div className="p-4 rounded-xl bg-[#111827] border border-white/5 shadow-md space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7bd0ff]">visibility</span>
              <h3 className="text-sm font-bold text-white">AUDITOR / Visitante</h3>
            </div>
            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#7bd0ff]/15 text-[#7bd0ff] font-bold">
              SOLO LECTURA
            </span>
          </div>
          <p className="text-xs text-[#bccbb8]">
            Acceso modo consulta a series históricas TimescaleDB, reportes ejecutivos de disponibilidad y libros de eventos. Sin permisos de modificación o cierre.
          </p>
          <div className="pt-2 border-t border-white/5 font-mono text-[10px] text-[#869583]">
            @PreAuthorize("hasRole('AUDITOR')")
          </div>
        </div>
      </div>

      {/* USERS MASTER TABLE */}
      <div className="bg-[#111827] rounded-xl border border-white/5 shadow-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-[#181c24] border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#06B6D4] text-[20px]">badge</span>
            <span className="text-sm font-bold text-white">Catálogo de Usuarios Registrados</span>
            <span className="font-mono text-xs text-[#869583]">({filteredUsers.length} cuentas)</span>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-2 text-[#869583] text-[18px]">search</span>
            <input
              type="text"
              placeholder="Buscar operador o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B0F17] pl-9 pr-3 py-1.5 rounded-lg border border-white/10 text-xs text-white placeholder-[#869583] focus:outline-none focus:border-[#00B042]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0a0e16] font-mono text-[10px] text-[#869583] uppercase tracking-wider border-b border-white/5">
                <th className="py-3 px-4">Usuario / Credencial</th>
                <th className="py-3 px-4">Rol Asignado</th>
                <th className="py-3 px-4">Cargo / Unidad</th>
                <th className="py-3 px-4">Estado Cuenta</th>
                <th className="py-3 px-4">Último Acceso</th>
                <th className="py-3 px-4 text-right">Acciones de Acceso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => {
                const isCurrent = currentUser.id === user.id;

                return (
                  <tr
                    key={user.id}
                    className={`hover:bg-[#1c2028]/60 transition-colors ${
                      !user.activo ? 'opacity-50 bg-[#EF4444]/5' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          user.rol === 'ADMIN'
                            ? 'bg-[#EF4444]/20 text-[#EF4444]'
                            : user.rol === 'OPERADOR'
                            ? 'bg-[#00B042]/20 text-[#00B042]'
                            : 'bg-[#7bd0ff]/20 text-[#7bd0ff]'
                        }`}>
                          {user.nombre.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">
                            {user.nombre} {isCurrent && <span className="text-[#00B042] font-mono text-[10px]">(Tú)</span>}
                          </span>
                          <span className="font-mono text-[10px] text-[#869583]">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      {isAdmin ? (
                        <select
                          value={user.rol}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="bg-[#1c2028] px-2 py-1 rounded border border-white/10 text-white cursor-pointer"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="OPERADOR">OPERADOR</option>
                          <option value="AUDITOR">AUDITOR</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.rol === 'ADMIN'
                            ? 'bg-[#EF4444]/20 text-[#EF4444]'
                            : user.rol === 'OPERADOR'
                            ? 'bg-[#00B042]/20 text-[#00B042]'
                            : 'bg-[#7bd0ff]/20 text-[#7bd0ff]'
                        }`}>
                          {user.rol}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-white block">{user.cargo}</span>
                      <span className="font-mono text-[10px] text-[#869583]">{user.badge}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.activo ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.activo ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></span>
                        {user.activo ? 'ACTIVO' : 'BLOQUEADO'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[#869583] text-[11px]">
                      {user.ultimoAcceso}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 font-mono text-[11px]">
                        {/* Switch Session Role Button */}
                        <button
                          onClick={() => {
                            if (!user.activo) {
                              triggerToast('No se puede cambiar a un usuario con cuenta bloqueada.');
                              return;
                            }
                            onSwitchUser(user);
                            triggerToast(`Sesión cambiada a ${user.nombre} (${user.rol}). Token JWT regenerado.`);
                          }}
                          className="px-2.5 py-1 rounded bg-[#1c2028] hover:bg-[#262a33] text-[#7bd0ff] hover:text-white border border-white/5 transition-colors cursor-pointer"
                          title="Simular inicio de sesión como este usuario"
                        >
                          {isCurrent ? 'Sesión Actual' : 'Asumir Rol'}
                        </button>

                        {/* Admin Toggle */}
                        {isAdmin && !isCurrent && (
                          <button
                            onClick={() => handleToggleActive(user.id)}
                            className={`p-1 rounded cursor-pointer ${
                              user.activo
                                ? 'bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20'
                                : 'bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20'
                            }`}
                            title={user.activo ? 'Desactivar usuario (Bloqueo de token)' : 'Reactivar usuario'}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {user.activo ? 'block' : 'lock_open'}
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD NEW USER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00B042]">person_add</span>
                <h3 className="text-base font-bold text-white">Registrar Nuevo Usuario RTOC</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-[#869583] hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3 font-sans text-xs">
              <div>
                <label className="block text-[#bccbb8] mb-1 font-mono uppercase">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ing. Mauricio Gómez"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-[#bccbb8] mb-1 font-mono uppercase">Correo Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="usuario@ecopetrol.com.co"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-[#bccbb8] mb-1 font-mono uppercase">Cargo / Puesto Operacional *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Analista de Telemetría Nivel 1"
                  value={newCargo}
                  onChange={(e) => setNewCargo(e.target.value)}
                  className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-[#bccbb8] mb-1 font-mono uppercase">Rol Inicial RBAC</label>
                <select
                  value={newRol}
                  onChange={(e) => setNewRol(e.target.value as UserRole)}
                  className="w-full bg-[#0B0F17] p-2.5 rounded-lg border border-white/10 text-white cursor-pointer font-mono"
                >
                  <option value="OPERADOR">OPERADOR (Gestión activa de telemetría y alertas)</option>
                  <option value="AUDITOR">AUDITOR (Solo lectura de históricos y reportes)</option>
                  <option value="ADMIN">ADMIN (Control total de usuarios y umbrales)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-white/10 font-mono">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#1c2028] text-white hover:bg-[#262a33]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#00B042] text-[#0B0F17] font-bold hover:bg-[#52e16c]"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
