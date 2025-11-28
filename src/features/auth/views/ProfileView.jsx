import React, { useState, useEffect } from 'react';
import { useToast } from '../../../contexts/ToastContext';

const ProfileView = () => {
    const [user, setUser] = useState({ nombre: '', email: '', telefono: '' });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const { addToast } = useToast();

    useEffect(() => {
        // Cargar datos del usuario desde localStorage o API
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser({
            nombre: storedUser.nombre || '',
            email: storedUser.email || '',
            telefono: storedUser.telefono || ''
        });
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nombre: user.nombre, telefono: user.telefono })
            });

            if (!response.ok) throw new Error('Error al actualizar perfil');

            const result = await response.json();
            localStorage.setItem('user', JSON.stringify(result.user));
            addToast('Perfil actualizado correctamente', 'success');
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return addToast('Las contraseñas no coinciden', 'error');
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3000/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.new
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al cambiar contraseña');
            }

            addToast('Contraseña cambiada exitosamente', 'success');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            addToast(error.message, 'error');
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#2D3748' }}>Mi Perfil</h1>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {/* Datos Personales */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#4A5568' }}>Datos Personales</h2>
                    <form onSubmit={handleProfileUpdate}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#718096' }}>Nombre Completo</label>
                            <input
                                type="text"
                                value={user.nombre}
                                onChange={e => setUser({ ...user, nombre: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E0' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#718096' }}>Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F7FAFC' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#718096' }}>Teléfono</label>
                            <input
                                type="tel"
                                value={user.telefono}
                                onChange={e => setUser({ ...user, telefono: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E0' }}
                            />
                        </div>
                        <button type="submit" style={{ background: '#FF7B54', color: 'white', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Guardar Cambios
                        </button>
                    </form>
                </div>

                {/* Cambiar Contraseña */}
                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#4A5568' }}>Seguridad</h2>
                    <form onSubmit={handlePasswordChange}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#718096' }}>Contraseña Actual</label>
                            <input
                                type="password"
                                value={passwords.current}
                                onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E0' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#718096' }}>Nueva Contraseña</label>
                                <input
                                    type="password"
                                    value={passwords.new}
                                    onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E0' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#718096' }}>Confirmar Contraseña</label>
                                <input
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #CBD5E0' }}
                                />
                            </div>
                        </div>
                        <button type="submit" style={{ background: 'white', color: '#2D3748', border: '1px solid #CBD5E0', padding: '0.75rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Actualizar Contraseña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
