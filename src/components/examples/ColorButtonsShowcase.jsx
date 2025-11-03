import { Space, Divider } from 'antd';
import { 
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  StarOutlined,
  HeartOutlined,
  InfoCircleOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  EyeOutlined
} from '@ant-design/icons';
import PrimaryButton from '../atoms/PrimaryButton';
import SuccessButton from '../atoms/SuccessButton';
import WarningButton from '../atoms/WarningButton';
import DangerButton from '../atoms/DangerButton';
import DefaultButton from '../atoms/DefaultButton';
import PurpleButton from '../atoms/PurpleButton';
import PinkButton from '../atoms/PinkButton';
import CyanButton from '../atoms/CyanButton';
import YellowButton from '../atoms/YellowButton';
import MagentaButton from '../atoms/MagentaButton';
import DarkGreenButton from '../atoms/DarkGreenButton';
import IndigoButton from '../atoms/IndigoButton';

/**
 * ColorButtonsShowcase - Demostración de todos los botones de colores
 * 
 * Componente de ejemplo que muestra los 12 tipos de botones disponibles
 * con sus colores y usos recomendados.
 * 
 * @component
 * @example
 * <ColorButtonsShowcase />
 */
const ColorButtonsShowcase = () => {
  const handleClick = (color) => {
    console.log(`Clicked ${color} button`);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>🎨 Paleta de Botones de Colores</h1>
      
      <Divider orientation="left">Botones Base (5)</Divider>
      <Space wrap size="middle">
        <PrimaryButton 
          icon={<PlusOutlined />} 
          onClick={() => handleClick('Primary')}
        >
          Primary (Azul)
        </PrimaryButton>
        
        <SuccessButton 
          icon={<CheckCircleOutlined />} 
          onClick={() => handleClick('Success')}
        >
          Success (Verde)
        </SuccessButton>
        
        <WarningButton 
          icon={<WarningOutlined />} 
          onClick={() => handleClick('Warning')}
        >
          Warning (Naranja)
        </WarningButton>
        
        <DangerButton 
          icon={<DeleteOutlined />} 
          onClick={() => handleClick('Danger')}
        >
          Danger (Rojo)
        </DangerButton>
        
        <DefaultButton 
          onClick={() => handleClick('Default')}
        >
          Default (Gris)
        </DefaultButton>
      </Space>

      <Divider orientation="left">Botones de Colores Sólidos (7)</Divider>
      <Space wrap size="middle">
        <PurpleButton 
          icon={<StarOutlined />} 
          onClick={() => handleClick('Purple')}
        >
          Purple (Morado) - Premium
        </PurpleButton>
        
        <PinkButton 
          icon={<HeartOutlined />} 
          onClick={() => handleClick('Pink')}
        >
          Pink (Rosado) - Favorito
        </PinkButton>
        
        <CyanButton 
          icon={<InfoCircleOutlined />} 
          onClick={() => handleClick('Cyan')}
        >
          Cyan (Cian) - Info
        </CyanButton>
        
        <YellowButton 
          icon={<StarOutlined />} 
          onClick={() => handleClick('Yellow')}
        >
          Yellow (Amarillo) - Destacar
        </YellowButton>
        
        <MagentaButton 
          icon={<CrownOutlined />} 
          onClick={() => handleClick('Magenta')}
        >
          Magenta (Fucsia) - Especial
        </MagentaButton>
        
        <DarkGreenButton 
          icon={<CheckCircleOutlined />} 
          onClick={() => handleClick('DarkGreen')}
        >
          Dark Green (Verde Oscuro) - Confirmar
        </DarkGreenButton>
        
        <IndigoButton 
          icon={<ThunderboltOutlined />} 
          onClick={() => handleClick('Indigo')}
        >
          Indigo (Índigo) - Ejecutar
        </IndigoButton>
      </Space>

      <Divider orientation="left">Variantes de Tamaño</Divider>
      <Space wrap size="middle" align="center">
        <PurpleButton size="small" icon={<StarOutlined />}>
          Small
        </PurpleButton>
        <PurpleButton size="middle" icon={<StarOutlined />}>
          Middle (Default)
        </PurpleButton>
        <PurpleButton size="large" icon={<StarOutlined />}>
          Large
        </PurpleButton>
      </Space>

      <Divider orientation="left">Estados</Divider>
      <Space wrap size="middle">
        <PurpleButton icon={<StarOutlined />}>
          Normal
        </PurpleButton>
        <PurpleButton icon={<StarOutlined />} loading>
          Loading
        </PurpleButton>
        <PurpleButton icon={<StarOutlined />} disabled>
          Disabled
        </PurpleButton>
      </Space>

      <Divider orientation="left">Tabla de Colores</Divider>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16 
      }}>
        <ColorCard color="#1890ff" name="Primary" hex="#1890ff" use="Acciones principales" />
        <ColorCard color="#52c41a" name="Success" hex="#52c41a" use="Confirmaciones" />
        <ColorCard color="#faad14" name="Warning" hex="#faad14" use="Advertencias" />
        <ColorCard color="#ff4d4f" name="Danger" hex="#ff4d4f" use="Eliminar" />
        <ColorCard color="#d9d9d9" name="Default" hex="#d9d9d9" use="Secundario" />
        <ColorCard color="#722ed1" name="Purple" hex="#722ed1" use="Premium" />
        <ColorCard color="#eb2f96" name="Pink" hex="#eb2f96" use="Favoritos" />
        <ColorCard color="#13c2c2" name="Cyan" hex="#13c2c2" use="Información" />
        <ColorCard color="#faad14" name="Yellow" hex="#faad14" use="Destacar" />
        <ColorCard color="#c41d7f" name="Magenta" hex="#c41d7f" use="Especial" />
        <ColorCard color="#389e0d" name="Dark Green" hex="#389e0d" use="Activar" />
        <ColorCard color="#2f54eb" name="Indigo" hex="#2f54eb" use="Ejecutar" />
      </div>
    </div>
  );
};

/**
 * ColorCard - Tarjeta para mostrar información de color
 */
const ColorCard = ({ color, name, hex, use }) => {
  return (
    <div style={{
      border: '1px solid #d9d9d9',
      borderRadius: 8,
      padding: 16,
      textAlign: 'center'
    }}>
      <div style={{
        width: '100%',
        height: 60,
        backgroundColor: color,
        borderRadius: 4,
        marginBottom: 12
      }} />
      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>{hex}</div>
      <div style={{ fontSize: 12, color: '#999' }}>{use}</div>
    </div>
  );
};

export default ColorButtonsShowcase;
