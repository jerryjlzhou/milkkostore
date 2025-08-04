import Image from 'next/image';

const PaymentCardIcons = () => (
  <div className="flex items-center gap-3 mt-3">
    <div className="text-xs text-gray-500 font-medium">We accept:</div>
    <div className="flex items-center gap-2">
      {/* Visa SVG */}
      <div className="w-12 h-7 bg-white rounded border shadow-sm flex items-center justify-center p-1">
        <Image
          src="/images/payment-icons/Visa Symbol SVG.svg"
          alt="Visa"
          width={40}
          height={24}
          className="object-contain"
        />
      </div>

      {/* Mastercard SVG */}
      <div className="w-12 h-7 bg-white rounded border shadow-sm flex items-center justify-center p-1">
        <Image
          src="/images/payment-icons/Mastercard Symbol SVG.svg"
          alt="Mastercard"
          width={38}
          height={24}
          className="object-contain"
        />
      </div>

      {/* American Express SVG */}
      <div className="w-12 h-7 bg-[#006FCF] rounded border shadow-sm flex items-center justify-center overflow-hidden">
        <Image
          src="/images/payment-icons/American Express Symbol SVG.svg"
          alt="American Express"
          width={32}
          height={28}
          className="object-cover"
          style={{ objectPosition: 'center' }}
        />
      </div>

      {/* Discover SVG */}
      <div className="w-12 h-7 bg-white rounded border shadow-sm flex items-center justify-center p-1">
        <Image
          src="/images/payment-icons/DGN_AcceptanceMark.png"
          alt="Discover"
          width={40}
          height={24}
          className="object-contain scale-110"
        />
      </div>

      {/* Diners SVG */}
      <div className="w-12 h-7 bg-white rounded border shadow-sm flex items-center justify-center p-1">
        <Image
          src="/images/payment-icons/DCI_AcceptanceMark.png"
          alt="Diners Club"
          width={40}
          height={24}
          className="object-contain scale-105"
        />
      </div>
    </div>
  </div>
);

export default PaymentCardIcons;
