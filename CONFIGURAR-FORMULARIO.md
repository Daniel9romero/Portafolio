# Cómo Configurar el Formulario de Contacto

El formulario de contacto usa **Web3Forms**, un servicio gratuito que permite recibir emails sin necesidad de backend.

## Pasos para activar el formulario:

### 1. Crear cuenta en Web3Forms (GRATIS)

1. Ve a: https://web3forms.com/
2. Haz clic en "Get Started"
3. Ingresa tu email: **daniel9romero@hotmail.com**
4. Te enviarán un código de verificación
5. Verifica tu email

### 2. Obtener tu Access Key

1. Una vez verificado, verás tu **Access Key**
2. Copia ese código (algo como: `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

### 3. Agregar el Access Key al código

1. Abre el archivo: `src/components/ContactForm.tsx`
2. Busca la línea que dice: `access_key: 'YOUR_ACCESS_KEY_HERE'`
3. Reemplaza `'YOUR_ACCESS_KEY_HERE'` con tu Access Key real
4. Guarda el archivo

Ejemplo:
```typescript
access_key: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
```

### 4. ¡Listo!

Ahora cuando alguien envíe el formulario, recibirás un email en: **daniel9romero@hotmail.com**

## Características del formulario:

✅ Validación de campos (nombre, email, mensaje son requeridos)
✅ Estados de carga (muestra "Enviando..." mientras procesa)
✅ Mensajes de éxito/error
✅ Auto-limpieza del formulario después de enviar
✅ Diseño responsive
✅ Modo oscuro compatible
✅ Animaciones suaves

## Alternativa: Usar mailto (más simple pero menos profesional)

Si prefieres no usar Web3Forms, puedes hacer que el botón simplemente abra el cliente de email:

1. Reemplaza el formulario con un simple botón:
```tsx
<Button asChild>
  <a href="mailto:daniel9romero@hotmail.com?subject=Contacto desde portafolio">
    Enviar Email
  </a>
</Button>
```

Pero esto es menos profesional y el usuario debe tener configurado un cliente de email.

---

## ¿Necesitas ayuda?

Si tienes problemas configurando Web3Forms, avísame y te ayudo.
