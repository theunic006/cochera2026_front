import Input from '../atoms/Input';
import { SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

/**
 * SearchBar Molecule - Barra de búsqueda con icono
 * 
 * @component
 * @example
 * <SearchBar 
 *   placeholder="Buscar..." 
 *   onSearch={handleSearch}
 * />
 */
const SearchBar = ({ 
  value,
  defaultValue,
  placeholder = 'Buscar...',
  size = 'middle',
  allowClear = true,
  onSearch,
  onChange,
  onPressEnter,
  loading = false,
  disabled = false,
  className = '',
  style = {},
  ...rest 
}) => {
  const handleSearch = (value) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, e);
    }
  };

  const handlePressEnter = (e) => {
    if (onPressEnter) {
      onPressEnter(e.target.value, e);
    }
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <Input.Search
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      size={size}
      allowClear={allowClear}
      onSearch={handleSearch}
      onChange={handleChange}
      onPressEnter={handlePressEnter}
      loading={loading}
      disabled={disabled}
      enterButton={<SearchOutlined />}
      className={className}
      style={style}
      {...rest}
    />
  );
};

SearchBar.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  placeholder: PropTypes.string,
  size: PropTypes.oneOf(['large', 'middle', 'small']),
  allowClear: PropTypes.bool,
  onSearch: PropTypes.func,
  onChange: PropTypes.func,
  onPressEnter: PropTypes.func,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SearchBar;
